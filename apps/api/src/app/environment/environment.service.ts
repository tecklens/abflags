import {Injectable, Logger, NotFoundException,} from '@nestjs/common';
import {createHash} from 'crypto';
import hat from 'hat';
import {v4 as uuidv4} from 'uuid';
import {CreateEnvironmentRequestDto, EnvironmentResponseDto} from './dtos';
import {EnvironmentEntity, EnvironmentRepository} from "@repository/environment";
import {ApiException, IApiKey, IJwtPayload} from "@abflags/shared";
import * as process from "process";
import {ApiKeyRepository} from "@repository/api-key";
import {decryptApiKey, encryptApiKey} from "../../utils";
import {Transactional} from "typeorm-transactional";

const API_KEY_GENERATION_MAX_RETRIES = 5;

@Injectable()
export class EnvironmentService {
  constructor(
    private environmentRepository: EnvironmentRepository,
    private apiKeyRepository: ApiKeyRepository
  ) {
  }

  @Transactional()
  async createEnvironment(
    user: IJwtPayload,
    d: CreateEnvironmentRequestDto,
    parentEnvironmentId: string,
  ): Promise<EnvironmentEntity> {
    const key = await this.generateUniqueApiKey();
    const encryptedApiKey = encryptApiKey(key, process.env.STORE_ENCRYPTION_KEY);
    const hashedApiKey = createHash('sha256').update(key).digest('hex');

    const environment = await this.environmentRepository.save({
      _projectId: user.projectId,
      name: d.name,
      identifier: uuidv4(),
      _parentId: parentEnvironmentId,
      createdBy: user._id,
      updatedBy: user._id,
    });

    await this.apiKeyRepository.save({
      _environmentId: environment._id,
      hash: hashedApiKey,
      key: encryptedApiKey,
      _userId: user._id,
    })

    return environment;
  }

  async getMeEnvironment(user: IJwtPayload) {
    const environment =
      await this.environmentRepository.findOne(
        {
          where: {
            _id: user.environmentId,
            _projectId: user.projectId,
          }
        },
      );

    if (!environment)
      throw new NotFoundException(
        `Environment ${user.environmentId} not found`,
      );

    return environment;
  }

  async getListEnvironment({
                             projectId,
                           }: {
    projectId: string;
  }): Promise<EnvironmentResponseDto[]> {
    Logger.verbose('Getting Environments');

    const environments =
      await this.environmentRepository.findProjectEnvironments(
        projectId,
      );

    if (!environments?.length)
      throw new NotFoundException(
        `Environments for project ${projectId} not found`,
      );

    return environments.map((environment) => {
      return {
        _id: environment._id,
        _projectId: environment._projectId,
        _parentId: environment._parentId,
        name: environment.name,
        identifier: environment.identifier,
      };
    });
  }

  async getApiKey(user: IJwtPayload): Promise<IApiKey[]> {
    const keys = await this.apiKeyRepository.getApiKeys(
      user.environmentId,
    );

    return keys.map((apiKey: IApiKey) => {
      return {
        key: decryptApiKey(apiKey.key, process.env.STORE_ENCRYPTION_KEY),
        _userId: apiKey._userId,
        _environmentId: apiKey._environmentId,
      };
    });
  }

  async generateApiKey(user: IJwtPayload): Promise<IApiKey> {
    const environment = await this.environmentRepository.findOneBy({
      _id: user.environmentId,
    });

    if (!environment) {
      throw new ApiException(`Environment id: ${user.environmentId} not found`);
    }

    const key = await this.generateUniqueApiKey();
    const encryptedApiKey = encryptApiKey(key, process.env.STORE_ENCRYPTION_KEY);
    const hashedApiKey = createHash('sha256').update(key).digest('hex');

    return this.apiKeyRepository.save({
      _environmentId: user.environmentId,
      key: encryptedApiKey,
      _userId: user._id,
      hash: hashedApiKey,
    });
  }

  async generateUniqueApiKey() {
    let apiKey = '';
    apiKey = this.generateHatApiKey();
    return apiKey as string;
  }

  /**
   * Extracting the generation functionality so it can be stubbed for functional testing
   *
   * @requires hat
   * @todo Dependency is no longer accessible to source code due of removal from GitHub. Consider look for an alternative.
   */
  private generateHatApiKey(): string {
    return hat();
  }
}
