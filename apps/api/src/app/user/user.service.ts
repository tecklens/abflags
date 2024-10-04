import {BadRequestException, Inject, Injectable, Logger, NotFoundException,} from '@nestjs/common';
import {Cache, CACHE_MANAGER, CacheKey} from '@nestjs/cache-manager';
import {v4 as uuidv4} from 'uuid';
import {HttpStatusCode} from 'axios';
import * as bcrypt from 'bcrypt';
import {HttpService} from '@nestjs/axios';
import {
  ChangePassDto,
  ChangeProfileDto,
  ChangeProfileEmailDto,
  UserOnboardingRequestDto,
  UserOnboardingTourRequestDto,
  UserResponseDto,
} from './dtos';
import {EnvironmentRepository} from "@repository/environment";
import {UserRepository} from "@repository/user";
import {IJwtPayload, IUser, normalizeEmail} from "@abflags/shared";
import {buildAuthServiceKey, buildUserKey, decryptApiKey} from "../../utils";
import {ApiKeyRepository} from "@repository/api-key";

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private environmentRepository: EnvironmentRepository,
    private apiKeyRepository: ApiKeyRepository,
    private readonly httpService: HttpService,
  ) {
  }

  @CacheKey('user:profile')
  public async getMyProfile(userId: string): Promise<UserResponseDto> {
    Logger.verbose('Getting User from user repository in Command');
    Logger.debug('Getting user data for ' + userId);
    const profile = await this.userRepository.findById(userId);

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    Logger.verbose('Found User');

    return this.mapProfileUser(profile);
  }

  public async updateProfileEmail(u: IJwtPayload, d: ChangeProfileEmailDto): Promise<UserResponseDto> {
    const email = normalizeEmail(d.email);
    const user = await this.userRepository.findByEmail(email);
    if (user) throw new BadRequestException('E-mail is invalid or taken');

    await this.userRepository.update(
      {
        _id: u._id,
      },
      {
        email,
      },
    );

    await this.cacheManager.del(
      buildUserKey({
        _id: u._id,
      }),
    );

    const apiKeys = await this.apiKeyRepository.getApiKeys(
      u.environmentId,
    );

    const decryptedApiKey = decryptApiKey(apiKeys[0].key, process.env.STORE_ENCRYPTION_KEY);

    await this.cacheManager.del(
      buildAuthServiceKey({
        apiKey: decryptedApiKey,
      }),
    );

    const updatedUser = await this.userRepository.findById(u._id);
    if (!updatedUser) throw new NotFoundException('User not found');

    // this.analyticsService.setValue(updatedUser._id, 'email', email);

    return this.mapProfileUser(updatedUser);
  }

  public async updateProfile(u: IJwtPayload, d: ChangeProfileDto): Promise<UserResponseDto> {
    const email = normalizeEmail(d.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new BadRequestException('Account not exited');

    await this.userRepository.update(
      {
        _id: u._id,
      },
      {
        bio: d.bio,
        urls: d.urls,
        username: d.username,
      },
    );

    await this.cacheManager.del(
      buildUserKey({
        _id: u._id,
      }),
    );

    const updatedUser = await this.userRepository.findById(u._id);
    if (!updatedUser) throw new NotFoundException('User not found');

    // this.analyticsService.setValue(updatedUser._id, 'email', email);

    return this.mapProfileUser(updatedUser);
  }

  public async updateOnBoarding(u: IJwtPayload, d: UserOnboardingRequestDto): Promise<UserResponseDto> {
    await this.cacheManager.del(
      buildUserKey({
        _id: u._id,
      }),
    );

    await this.userRepository.update(
      {
        _id: u._id,
      },
      {
        showOnBoarding: d.showOnBoarding,
      },
    );

    const user = await this.userRepository.findById(u._id);
    if (!user) throw new NotFoundException('User not found');

    return this.mapProfileUser(user);
  }

  public async updateOnBoardingTour(
    u: IJwtPayload,
    d: UserOnboardingTourRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(u._id);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.update(
      {
        _id: u._id,
      },
      {
        showOnBoardingTour: d.showOnBoardingTour,
      },
    );

    await this.cacheManager.del(
      buildUserKey({
        _id: u._id,
      }),
    );

    const updatedUser = await this.userRepository.findById(u._id);
    if (!updatedUser) throw new NotFoundException('User not found');

    return this.mapProfileUser(updatedUser);
  }

  async updateGuide(u: IJwtPayload, type: string) {
    switch (type) {
      case 'billing':
        await this.userRepository.update(
          {
            _id: u._id,
          },
          {
            billingGuide: true,
          },
        );
        break;
      case 'api-key':
        await this.userRepository.update(
          {
            _id: u._id,
          },
          {
            apiKeyGuide: true,
          },
        );
        break;
      default:
        break;
    }
  }

  async sendChangePassword(u: IJwtPayload) {
    const tx_id = uuidv4();
    const user = await this.userRepository.findById(u._id);

    if (user) {
      await this.userRepository.update(
        {
          _id: user._id,
        },
        {
          changePasswordTransactionId: tx_id,
        },
      );

      const response = await this.httpService
        .request({
          method: 'POST',
          url: 'https://flow.wolfx.app/wolf/v1/trigger/',
          data: JSON.stringify({
            workflowId: '669237b10327d4603ce954a2',
            target: {
              subcriberId: `change-password-${tx_id}`,
              phone: '0339210372',
              email: user.email,
              tx_id: tx_id,
            },
            overrides: {},
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `ApiKey d171212c22a1fa2b7b4643a75fbf3e8e`,
          },
          validateStatus: null,
        })
        .toPromise();

      if (response.status === HttpStatusCode.Created) {
        console.debug('send change password success');
      } else {
        throw new BadRequestException(
          'There was an error when sending the password reset email.',
        );
      }
    }
  }

  async changePass(u: IJwtPayload, payload: ChangePassDto) {
    const user = await this.userRepository.findById(
      u._id,
    );

    if (
      !user ||
      payload.changePasswordTransactionId !== user.changePasswordTransactionId
    )
      throw new BadRequestException(
        'Invalid request. The Transaction ID is either unsuccessful or has expired.',
      );

    const passwordHash = await bcrypt.hash(payload.password, 10);

    await this.userRepository.update(
      {
        _id: user._id,
      },
      {
        password: passwordHash,
        changePasswordTransactionId: null,
      },
    );
  }

  private mapProfileUser(profile: IUser): UserResponseDto {
    return {
      _id: profile._id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      profilePicture: profile.profilePicture,
      createdAt: profile.createdAt,
      jobTitle: profile.jobTitle,
      showOnBoarding: profile.showOnBoarding,
    };
  }
}
