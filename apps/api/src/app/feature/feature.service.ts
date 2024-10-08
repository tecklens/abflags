import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {FeatureEntity, FeatureRepository, FeatureStrategyRepository} from "@repository/feature";
import {
  FEATURE_ARCHIVED, FEATURE_CREATED, FEATURE_ENABLE,
  FEATURE_TYPE_UPDATED,
  FeatureId,
  FeatureStatus,
  IBaseEvent,
  IJwtPayload,
  IPaginatedResponseDto
} from "@abflags/shared";
import {CreateFeatureRequestDto, CreateStrategyRequest, FeatureDto, GetFeatureRequestDto} from "@app/feature/dtos";
import {Transactional} from "typeorm-transactional";
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";

@Injectable()
export class FeatureService {
  constructor(
    private readonly featureRepository: FeatureRepository,
    private readonly featureStrategyRepository: FeatureStrategyRepository,
    @InjectQueue('event') private eventQueue: Queue<IBaseEvent, string, string>,
  ) {
  }

  async getByActiveProject(u: IJwtPayload, payload: GetFeatureRequestDto): Promise<IPaginatedResponseDto<FeatureEntity>> {
    const rlt = await this.featureRepository.getByEnvIdAndProjectId(
      u.environmentId,
      u.projectId,
      payload.name,
      payload.status,
      payload.page * payload.limit,
      payload.limit,
    )
    return {
      page: payload.page,
      pageSize: payload.limit,
      data: rlt[0],
      total: rlt[1],
    }
  }

  async createFeature(u: IJwtPayload, payload: CreateFeatureRequestDto) {
    const name = payload.name.trim();
    if (await this.featureRepository.existByName(name)) {
      throw new ConflictException('Feature name is existed')
    }

    const newFeature = await this.featureRepository.save({
      _environmentId: u.environmentId,
      _projectId: u.projectId,
      createdBy: u.email,
      updatedBy: u.email,
      name: payload.name,
      description: payload.description,
      status: payload.status,
      tags: payload.tags,
    })

    await this.eventQueue.add('action', {
      _projectId: u.projectId,
      _environmentId: u.environmentId,
      tags: ['feature'],
      type: FEATURE_CREATED,
      featureId: newFeature._id
    })

    return newFeature;
  }

  async getByApiKey(u: IJwtPayload, payload: GetFeatureRequestDto): Promise<IPaginatedResponseDto<FeatureDto>> {
    const rlt = await this.featureRepository.getByEnvIdAndProjectId(
      u.environmentId,
      u.projectId,
      null,
      null,
      payload.page * payload.limit,
      payload.limit,
    )
    return {
      page: payload.page,
      pageSize: payload.limit,
      data: rlt[0]?.map(e => ({
        _id: e._id,
        name: e.name,
        status: e.status,
        behavior: e.behavior,
      })),
      total: rlt[1],
    }
  }

  async getFeatureById(u: IJwtPayload, id: FeatureId) {
    return this.featureRepository.getByEnvironmentIdAndId(
      u.environmentId,
      id,
    )
  }

  @Transactional()
  async archive(u: IJwtPayload, id: FeatureId) {
    const feature = await this.featureRepository.getByEnvironmentIdAndId(
      u.environmentId,
      id,
    )

    if (!feature) throw new NotFoundException();

    await this.eventQueue.add('action', {
      _projectId: u.projectId,
      _environmentId: u.environmentId,
      type: FEATURE_ARCHIVED,
      featureId: id,
      tags: ['feature']
    })

    return this.featureRepository.save({
      ...feature,
      status: FeatureStatus.ARCHIVE,
      archivedAt: new Date(),
    })
  }

  @Transactional()
  async enable(u: IJwtPayload, id: FeatureId) {
    const feature = await this.featureRepository.getByEnvironmentIdAndId(
      u.environmentId,
      id,
    )

    if (!feature) throw new NotFoundException();

    await this.eventQueue.add('action', {
      _projectId: u.projectId,
      _environmentId: u.environmentId,
      type: FEATURE_ENABLE,
      featureId: id,
      tags: ['feature', 'enable']
    })

    return this.featureRepository.save({
      ...feature,
      status: FeatureStatus.ACTIVE,
      archivedAt: new Date(),
    })
  }

  async createStrategy(u: IJwtPayload, id: FeatureId, payload: CreateStrategyRequest) {
    return this.featureStrategyRepository.save({
      featureId: id,
      conditions: payload.conditions,
      name: payload.name,
      sortOrder: payload.sortOrder,
      description: payload.description,
      status: payload.status,
      createdBy: u._id,
      updatedBy: u._id,
    })
  }

  async getAllStrategy(u: IJwtPayload, id: FeatureId) {
    return this.featureStrategyRepository.findBy({
      featureId: id,
    })
  }
}
