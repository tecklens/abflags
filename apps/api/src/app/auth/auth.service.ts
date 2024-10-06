import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isBefore,
  parseISO,
  subDays,
} from 'date-fns';
import { EnvironmentService } from '@app/environment/environment.service';
import {
  CreateProjectDto,
  LoginBodyDto,
  PasswordResetBodyDto,
  UserRegistrationBodyDto,
} from './dtos';
import { EnvironmentRepository } from '@repository/environment';
import {
  consumePoints,
  consumeSecondPoints,
  UserEntity,
  UserRepository,
} from '@repository/user';
import { MemberEntity, MemberRepository } from '@repository/member';
import { UserService } from '@app/user/user.service';
import {
  ApiException,
  AuthProviderEnum,
  IApiKeyValid,
  IJwtPayload,
  IUser,
  IUserResetTokenCount,
  makeid,
  MemberRoleEnum,
  MemberStatusEnum,
  normalizeEmail,
  UserPlan,
} from '@abflags/shared';
import { ProjectEntity, ProjectRepository } from '@repository/project';
import { LimitService } from '@app/auth/limit.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ApiKeyRepository } from '@repository/api-key';
import { Transactional } from 'typeorm-transactional';
import { buildUserKey } from '../../utils';
import process from 'process';
import { Cache } from 'cache-manager';
import { VariableRepository } from '@repository/variable';
import { variableDefault } from '../../../../../libs/shared/src/lib/entities/variable/variable-default';

@Injectable()
export class AuthService {
  private MAX_ATTEMPTS_IN_A_MINUTE = 5;
  private MAX_ATTEMPTS_IN_A_DAY = 15;
  private RATE_LIMIT_IN_SECONDS = 60;
  private RATE_LIMIT_IN_HOURS = 24;

  private BLOCKED_PERIOD_IN_MINUTES = 5;
  private MAX_LOGIN_ATTEMPTS = 5;

  constructor(
    private readonly usersService: UserService,
    private readonly environmentService: EnvironmentService,
    private readonly jwtService: JwtService,
    private readonly environmentRepository: EnvironmentRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly variableRepository: VariableRepository,
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly limitService: LimitService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async validateUserLocal(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(password, 10);
    return await this.userRepository.findByEmailAndPassword(
      email,
      passwordHash,
    );
  }

  public async validateUser(payload: IJwtPayload): Promise<IUser> {
    // We run these in parallel to speed up the query time
    const userPromise = this.getUser({ _id: payload._id });
    const isMemberPromise = payload.projectId
      ? await this.isAuthenticatedForProject(payload._id, payload.projectId)
      : true;
    const [user, isMember]: [IUser, boolean] = await Promise.all([
      userPromise,
      isMemberPromise,
    ]);

    if (!user) throw new UnauthorizedException('User not found');
    if (payload.projectId && !isMember) {
      throw new UnauthorizedException(
        `Not authorized for organization ${payload.projectId}`,
      );
    }

    return user;
  }

  public async authenticate(
    authProvider: AuthProviderEnum,
    accessToken: string,
    refreshToken: string,
    profile: {
      name: string;
      login: string;
      email: string;
      avatar_url: string;
      id: string;
      company: string;
      blog: string;
      location: string;
    },
    distinctId: string,
    origin?: string,
  ) {
    const email = normalizeEmail(profile.email);
    let user = await this.userRepository.findByEmail(email);
    let newUser = false;

    if (!user) {
      const firstName = profile.name
        ? profile.name.split(' ').slice(0, -1).join(' ')
        : profile.login;
      const lastName = profile.name
        ? profile.name.split(' ').slice(-1).join(' ')
        : null;

      user = await this.userRepository.save({
        profilePicture: profile.avatar_url,
        email,
        firstName,
        lastName,
        showOnBoarding: true,
        tokens: {
          username: profile.login,
          profileId: profile.id,
          provider: authProvider,
          accessToken,
          refreshToken,
          valid: true,
        },
      });
      newUser = true;

      if (distinctId) {
        // this.analyticsService.alias(distinctId, user._id);
      }

      // this.analyticsService.track('[Authentication] - Signup', user._id, {
      //   loginType: authProvider,
      //   origin: origin,
      // });
      await this.createProject({
        name: profile.company || profile.email,
        userId: user._id,
        domain: '',
      });
    } else {
      // TODO update info user or analysis login
    }

    return {
      newUser,
      token: await this.generateUserToken(user),
    };
  }

  public async authenticateGoogle(
    authProvider: AuthProviderEnum,
    accessToken: string,
    refreshToken: string | undefined,
    profile: {
      id: string;
      displayName: string;
      name: {
        familyName: string;
        givenName: string;
      };
      emails: { value: string; verified: boolean }[];
      photos: { value: string }[];
    },
  ) {
    const { name, emails, photos } = profile;
    const email = normalizeEmail(emails[0].value);
    let user = await this.userRepository.findByEmail(email);
    let newUser = false;

    if (!user) {
      const firstName = name.givenName;
      const lastName = name.familyName;

      user = await this.userRepository.save({
        profilePicture: photos[0].value,
        email,
        firstName,
        lastName,
        showOnBoarding: true,
        tokens: {
          username: profile.emails[0].value,
          profileId: profile.id,
          provider: authProvider,
          accessToken,
          refreshToken,
          valid: true,
        },
      });
      newUser = true;

      await this.createProject({
        name: email,
        userId: user._id,
        jobTitle: '',
        domain: '',
      });
    } else {
      // TODO update info user or analysis login
    }

    return {
      newUser,
      token: await this.generateUserToken(user),
    };
  }

  public async validateApiKey(apiKey: string): Promise<IJwtPayload> {
    const { environment, user, error } = await this.getApiKeyUser({
      apiKey,
    });

    if (error) throw new UnauthorizedException(error);

    let plan: UserPlan = user.plan;
    if (!plan) plan = UserPlan.free;

    const cPoint = consumePoints[plan];
    const cPointSecond = consumeSecondPoints[plan];

    try {
      await this.limitService
        .getLimiter()
        .consume(`${user._id}_${environment._id}`, cPoint);

      await this.limitService
        .getLimiterSecond()
        .consume(`${user._id}_${environment._id}`, cPointSecond);

      return {
        plan: user.plan,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        roles: [MemberRoleEnum.ADMIN],
        projectId: environment._projectId,
        environmentId: environment._id,
        exp: 0,
      };
    } catch (e) {
      throw new UnauthorizedException(
        'Exceeding the bucket limit for your account',
      );
    }
  }

  public async refreshToken(userId: string) {
    const user = await this.getUser({ _id: userId });
    if (!user) throw new UnauthorizedException('User not found');

    const members = await this.memberRepository.findMemberByUserId(userId);
    const projects = await this.projectRepository.findByProjectIdIn(
      members.map((e) => e._projectId),
    );

    if (projects.length > 0) {
      const activeProjectId = projects[0]._id;
      const userActiveProjects =
        await this.environmentRepository.findProjectEnvironments(
          activeProjectId,
        );

      return await this.getSignedToken(
        user,
        activeProjectId,
        userActiveProjects[0]._id,
        members[0],
      );
    } else {
      throw new ApiException('User not have project. Please contact support');
    }
  }

  public async generateUserToken(user: UserEntity) {
    const members = await this.memberRepository.findMemberByUserId(user._id);
    const projects = await this.projectRepository.findByProjectIdIn(
      members.map((e) => e._projectId),
    );

    if (projects && projects.length) {
      const projectToSwitch = projects[0];

      const userActiveProjects =
        await this.environmentRepository.findProjectEnvironments(
          projectToSwitch._id,
        );
      let environmentToSwitch = userActiveProjects[0];

      const reduceEnvsToOnlyDevelopment = (prev, current) =>
        current.name === 'Development' ? current : prev;

      if (userActiveProjects.length > 1) {
        environmentToSwitch = userActiveProjects.reduce(
          reduceEnvsToOnlyDevelopment,
          environmentToSwitch,
        );
      }

      if (environmentToSwitch) {
        return await this.switchEnvironment({
          newEnvironmentId: environmentToSwitch._id,
          projectId: projectToSwitch._id,
          userId: user._id,
        });
      }

      return await this.switchOrg({
        newProjectId: projectToSwitch._id,
        userId: user._id,
      });
    }

    return null;
  }

  private async switchOrg({
    newProjectId,
    userId,
  }: {
    newProjectId: string;
    userId: string;
  }) {
    const isAuthenticated = await this.isAuthenticatedForProject(
      userId,
      newProjectId,
    );
    if (!isAuthenticated) {
      throw new UnauthorizedException(
        `Not authorized for project ${newProjectId}`,
      );
    }

    const member = await this.memberRepository.findByUserIdAndProjectId(
      newProjectId,
      userId,
    );
    if (!member) throw new ApiException('Member not found');

    const user = await this.userRepository.findById(userId);
    if (!user) throw new ApiException(`User ${userId} not found`);

    const environment =
      await this.environmentRepository.findByProject(newProjectId);

    return await this.getSignedToken(
      user,
      newProjectId,
      environment?._id,
      member,
    );
  }

  private async isAuthenticatedForProject(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    return this.memberRepository.isMemberOfProject(projectId, userId);
  }

  async switchEnvironment({
    newEnvironmentId,
    projectId,
    userId,
  }: {
    newEnvironmentId: string;
    projectId: string;
    userId: string;
  }) {
    const project = await this.environmentRepository.findOneBy({
      _id: newEnvironmentId,
    });
    if (!project) throw new NotFoundException('Environment not found');
    if (project._projectId !== projectId) {
      throw new UnauthorizedException('Not authorized for project');
    }

    const member = await this.memberRepository.findByUserIdAndProjectId(
      projectId,
      userId,
    );
    if (!member) throw new NotFoundException('Member is not found');

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User is not found');

    return await this.getSignedToken(user, projectId, newEnvironmentId, member);
  }

  public async getSignedToken(
    user: UserEntity,
    projectId: string,
    environmentId: string,
    member?: MemberEntity,
  ): Promise<string> {
    const roles: MemberRoleEnum[] = [];
    if (member && member.roles) {
      roles.push(...member.roles?.map((e) => MemberRoleEnum[e]));
    }

    return this.jwtService.sign(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        projectId: projectId || null,
        roles,
        environmentId: environmentId || null,
        plan: user.plan,
      },
      {
        expiresIn: '30 days',
        issuer: 'wolf_api',
      },
    );
  }

  @Transactional()
  public async userRegistration(body: UserRegistrationBodyDto) {
    if (process.env.DISABLE_USER_REGISTRATION === 'true')
      throw new ApiException('Account creation is disabled');

    const email = normalizeEmail(body.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ApiException('User already exists');

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await this.userRepository.save({
      email,
      firstName: body.firstName.toLowerCase(),
      lastName: body.lastName?.toLowerCase(),
      password: passwordHash,
      billingCode: makeid(16),
    });

    const newProject: { project: ProjectEntity; environmentId: any } = await this.createProject({
      name: body.projectName || body.email,
      userId: user._id,
      jobTitle: body.jobTitle,
      domain: body.domain,
    });

    return {
      // user: await this.userRepository.findById(user._id),
      token: await this.getSignedToken(
        user,
        newProject.project._id,
        newProject.environmentId,
        null,
      ),
    };
  }

  private getRandomNumberString() {
    return Math.floor(100000 + Math.random() * 900000).toString(10);
  }

  public async resetPassword(d: { email: string }) {
    const email = normalizeEmail(d.email);
    const foundUser = await this.userRepository.findByEmail(email);
    if (foundUser && foundUser.email) {
      const { error, isBlocked } = this.isRequestBlocked(foundUser);
      if (isBlocked) {
        throw new UnauthorizedException(error);
      }
      const token = this.getRandomNumberString();

      await this.cacheManager.del(
        buildUserKey({
          _id: foundUser._id,
        }),
      );

      const resetTokenCount = this.getUpdatedRequestCount(foundUser);
      await this.userRepository.updatePasswordResetToken(foundUser._id, token);

      if (
        (process.env.NODE_ENV === 'dev' ||
          process.env.NODE_ENV === 'production') &&
        process.env.NOVU_API_KEY
      ) {
        // const wolf = new Novu(process.env.NOVU_API_KEY);
        //
        // wolf.trigger(process.env.NOVU_RESET_WOLF_IDENTIFIER || 'wolf', {
        //   to: {
        //     subscriberId:
        //       'mlsn.ce2b5e0c809f21b59b9a6abcffb8e90cacf296777e518e105cc8233dd63a2bab',
        //     email: 'diep.tv1999@gmail.com',
        //   },
        //   payload: {
        //     body: 'Hey dieptv1999! Reset password with OTP: ' + token,
        //   },
        // });
      }

      return {
        success: true,
      };
    }
  }

  public async passwordReset(d: PasswordResetBodyDto) {
    const user = await this.userRepository.findUserByToken(d.otp);
    if (!user) {
      throw new ApiException('Bad token provided');
    }

    if (
      user.resetTokenDate &&
      isBefore(user.resetTokenDate, subDays(new Date(), 7))
    ) {
      throw new ApiException('Token has expired');
    }

    const passwordHash = await bcrypt.hash(d.password, 10);

    await this.cacheManager.del(
      buildUserKey({
        _id: user._id,
      }),
    );

    await this.userRepository.update(
      {
        _id: user._id,
      },
      {
        password: passwordHash,
        resetToken: null,
        resetTokenDate: 1,
        resetTokenCount: null,
      },
    );
    const members = await this.memberRepository.findMemberByUserId(user._id);
    const projects = await this.projectRepository.findByProjectIdIn(
      members.map((e) => e._projectId),
    );

    if (projects.length > 0) {
      const userActiveProjects =
        await this.environmentRepository.findProjectEnvironments(
          projects[0]._id,
        );

      return {
        token: await this.getSignedToken(
          user,
          projects[0]._id,
          userActiveProjects[0]._id,
          members[0],
        ),
      };
    } else {
      throw new ApiException('User not Organization. Please contact support');
    }
  }

  public async login(d: LoginBodyDto) {
    const email = normalizeEmail(d.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      /**
       * maxWaitTime and minWaitTime(millisecond) are used to mimic the delay for server response times
       * received for existing users flow
       */
      const maxWaitTime = 110;
      const minWaitTime = 90;
      const randomWaitTime = Math.floor(
        Math.random() * (maxWaitTime - minWaitTime) + minWaitTime,
      );
      await new Promise((resolve) => setTimeout(resolve, randomWaitTime)); // will wait randomly for the chosen time to sync response time

      throw new UnauthorizedException('Incorrect email or password provided.');
    }

    // *: Trigger a password reset flow automatically for existing OAuth users instead of throwing an error
    if (!user.password) throw new ApiException('Please sign in using Github.');

    const isMatching = await bcrypt.compare(d.password, user.password);
    if (!isMatching) {
      throw new UnauthorizedException(`Incorrect email or password provided.`);
    }

    const members = await this.memberRepository.findMemberByUserId(user._id);
    const projects = await this.projectRepository.findByProjectIdIn(
      members.map((e) => e._projectId),
    );

    if (projects.length > 0) {
      const userActiveProjects =
        await this.environmentRepository.findProjectEnvironments(
          projects[0]._id,
        );

      return {
        token: await this.getSignedToken(
          user,
          projects[0]._id,
          userActiveProjects[0]._id,
          members[0],
        ),
      };
    } else {
      throw new ApiException('User not Organization. Please contact support');
    }
  }

  private getTimeDiffForAttempt(lastFailedAttempt: string) {
    const now = new Date();
    const formattedLastAttempt = parseISO(lastFailedAttempt);
    const diff = differenceInMinutes(now, formattedLastAttempt);

    return diff;
  }

  private getUpdatedRequestCount(user: UserEntity): IUserResetTokenCount {
    const now = new Date();
    const formattedDate = user.resetTokenDate ?? now;
    const diffSeconds = differenceInSeconds(new Date(), formattedDate);
    const diffHours = differenceInHours(new Date(), formattedDate);

    const resetTokenCount: IUserResetTokenCount = {
      reqInMinute: user.resetTokenCount?.reqInMinute ?? 0,
      reqInDay: user.resetTokenCount?.reqInDay ?? 0,
    };

    resetTokenCount.reqInMinute =
      diffSeconds < this.RATE_LIMIT_IN_SECONDS
        ? resetTokenCount.reqInMinute + 1
        : 1;
    resetTokenCount.reqInDay =
      diffHours < this.RATE_LIMIT_IN_HOURS ? resetTokenCount.reqInDay + 1 : 1;

    return resetTokenCount;
  }

  private isRequestBlocked(user: UserEntity) {
    const lastResetAttempt = user.resetTokenDate;

    if (!lastResetAttempt) {
      return {
        isBlocked: false,
        error: '',
      };
    }
    const diffSeconds = differenceInSeconds(new Date(), lastResetAttempt);
    const diffHours = differenceInHours(new Date(), lastResetAttempt);

    const withinDailyLimit = diffHours < this.RATE_LIMIT_IN_HOURS;
    const exceededDailyAttempt = user?.resetTokenCount
      ? user?.resetTokenCount?.reqInDay >= this.MAX_ATTEMPTS_IN_A_DAY
      : false;
    if (withinDailyLimit && exceededDailyAttempt) {
      return {
        isBlocked: true,
        error: `Too many requests, Try again after ${this.RATE_LIMIT_IN_HOURS} hours.`,
      };
    }

    const withinMinuteLimit = diffSeconds < this.RATE_LIMIT_IN_SECONDS;
    const exceededMinuteAttempt = user?.resetTokenCount
      ? user?.resetTokenCount?.reqInMinute >= this.MAX_ATTEMPTS_IN_A_MINUTE
      : false;
    if (withinMinuteLimit && exceededMinuteAttempt) {
      return {
        isBlocked: true,
        error: `Too many requests, Try again after a minute.`,
      };
    }

    return {
      isBlocked: false,
      error: '',
    };
  }

  @Transactional()
  private async createProject(d: CreateProjectDto) {
    const user = await this.userRepository.findById(d.userId);
    if (!user) throw new ApiException('User not found');

    const createdProject = await this.projectRepository.save({
      logo: d.logo,
      name: d.name,
      domain: d.domain,
      description: d.description,
    });

    if (d.jobTitle) {
      await this.updateJobTitle(user, d.jobTitle);
    }

    await this.addMember({
      roles: [MemberRoleEnum.ADMIN],
      projectId: createdProject._id,
      userId: user._id,
      isDefault: true,
    });

    await this.variableRepository.save(variableDefault.map(e => ({
      name: e.name,
      _projectId: createdProject._id,
      type: e.type,
      isDefault: e.isDefault,
      required: e.required,
      createdBy: user._id,
      updatedBy: user._id,
    })))

    const devEnv = await this.environmentService.createEnvironment(
      {
        plan: user.plan,
        _id: user._id,
        projectId: createdProject._id,
        environmentId: '',
        exp: 0,
        roles: [],
      },
      {
        name: 'DEV',
        parentId: '',
        // projectId: createdOrganization._id,
      },
      null,
    );
    await this.environmentService.createEnvironment(
      {
        plan: user.plan,
        _id: user._id,
        projectId: createdProject._id,
        environmentId: '',
        exp: 0,
        roles: [],
      },
      {
        name: 'PROD',
        parentId: '',
        // projectId: createdOrganization._id,
      },
      devEnv._id,
    );
    // create production env
    const projectAfterChanges = await this.projectRepository.findById(
      createdProject._id,
    );

    if (projectAfterChanges !== null) {
      await this.startFreeTrial(user._id, projectAfterChanges._id);
    }

    return {
      project: createdProject as ProjectEntity,
      environmentId: devEnv._id,
    };
  }

  private async updateJobTitle(user, jobTitle: string) {
    await this.userRepository.update(
      {
        _id: user._id,
      },
      {
        jobTitle: jobTitle,
      },
    );

    // this.analyticsService.setValue(user._id, 'jobTitle', jobTitle);
  }

  private async addMember({
    projectId,
    userId,
    roles,
    isDefault,
  }: {
    projectId: string;
    userId: string;
    roles: MemberRoleEnum[];
    isDefault: boolean;
  }) {
    const isAlreadyMember = await this.isMember(userId, projectId);
    if (isAlreadyMember) throw new ApiException('Member already exists');

    await this.memberRepository.addMember(
      projectId,
      {
        _userId: userId,
        roles: roles,
        memberStatus: MemberStatusEnum.ACTIVE,
      },
      isDefault,
    );
  }

  private async isMember(userId: string, projectId: string): Promise<boolean> {
    return !!(await this.memberRepository.findByUserIdAndProjectId(
      projectId,
      userId,
    ));
  }

  private async startFreeTrial(userId: string, projectId: string) {
    // try {
    //   if (
    //     process.env.wolf_ENTERPRISE === 'true' ||
    //     process.env.CI_EE_TEST === 'true'
    //   ) {
    //     if (!require('@wolf/ee-billing')?.StartReverseFreeTrial) {
    //       throw new BadRequestException('Billing module is not loaded');
    //     }
    //     const usecase = this.moduleRef.get(
    //       require('@wolf/ee-billing')?.StartReverseFreeTrial,
    //       {
    //         strict: false,
    //       },
    //     );
    //     await usecase.execute({
    //       userId,
    //       projectId,
    //     });
    //   }
    // } catch (e) {
    //   Logger.error(
    //     e,
    //     `Unexpected error while importing enterprise modules`,
    //     'StartReverseFreeTrial',
    //   );
    // }
  }

  private async getUser({ _id }: { _id: string }) {
    return await this.userRepository.findById(_id);
  }

  private async getApiKeyUser({
    apiKey,
  }: {
    apiKey: string;
  }): Promise<IApiKeyValid> {
    const cachedData = await this.cacheManager.get<IApiKeyValid>(apiKey);
    if (cachedData) {
      if (cachedData.environment) return cachedData;
      else {
        await this.cacheManager.del(apiKey);
      }
    }
    const hashedApiKey = createHash('sha256').update(apiKey).digest('hex');

    const key = await this.apiKeyRepository.findByApiKey({
      hash: hashedApiKey,
    });

    if (!key) {
      // Failed to find the environment for the provided API key.
      return { error: 'API Key not found' };
    }

    if (!key.environment) {
      return { error: 'API Key not found' };
    }

    const user = await this.userRepository.findById(key._userId);
    if (!user) {
      return { error: 'User not found' };
    }

    const rsp = { environment: key.environment, user: key.user };
    await this.cacheManager.set(apiKey, rsp);
    return rsp;
  }

  async getRemainingRequest(user: IJwtPayload) {
    const u = await this.userRepository.findById(user._id);
    if (!u) throw new UnauthorizedException('User not existed');

    let plan: UserPlan = user.plan;
    if (!plan) plan = UserPlan.free;

    const cPoint = consumePoints[plan];

    const rKey = await this.limitService
      .getLimiter()
      .get(`${user._id}_${user.environmentId}`);

    let remainPoint = 0;
    if (rKey) remainPoint = Math.round(rKey.remainingPoints / (cPoint ?? 1));

    return remainPoint;
  }

  async projectSwitch(u: IJwtPayload, newProjId: string): Promise<string> {
    const isAuthenticated = await this.isAuthenticatedForProject(
      u._id,
      newProjId,
    );
    if (!isAuthenticated) {
      throw new UnauthorizedException(
        `Not authorized for project ${newProjId}`,
      );
    }

    const member = await this.memberRepository.findByUserIdAndProjectId(
      newProjId,
      u._id,
    );
    if (!member) throw new ApiException('Member not found');

    const user = await this.userRepository.findById(u._id);
    if (!user) throw new ApiException(`User ${user._id} not found`);

    const environment = await this.environmentRepository.findOneBy({
      _projectId: newProjId,
    });

    return await this.getSignedToken(user, newProjId, environment?._id, member);
  }
}
