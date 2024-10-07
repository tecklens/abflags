import {Injectable, NotFoundException} from '@nestjs/common';
import {FeatureEntity, FeatureRepository} from "@repository/feature";
import {
  FEATURE_ARCHIVED,
  FEATURE_CREATED,
  FeatureId,
  FeatureStatus,
  IBaseEvent,
  IJwtPayload,
  IPaginatedResponseDto
} from "@abflags/shared";
import {CreateFeatureRequestDto, FeatureDto, GetFeatureRequestDto} from "@app/feature/dtos";
import {Transactional} from "typeorm-transactional";
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";

@Injectable()
export class FeatureService {
  constructor(
    private readonly featureRepository: FeatureRepository,
    @InjectQueue('event') private eventQueue: Queue<IBaseEvent, string, string>,
  ) {
  }

  async getByActiveProject(u: IJwtPayload, payload: GetFeatureRequestDto): Promise<IPaginatedResponseDto<FeatureEntity>> {
    const rlt = await this.featureRepository.getByEnvIdAndProjectId(
      u.environmentId,
      u.projectId,
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
    return this.featureRepository.save({
      _environmentId: u.environmentId,
      _projectId: u.projectId,
      createdBy: u.email,
      updatedBy: u.email,
      name: payload.name,
      description: payload.description,
      status: payload.status,
      tags: payload.tags,
    })
  }

  async getByApiKey(u: IJwtPayload, payload: GetFeatureRequestDto): Promise<IPaginatedResponseDto<FeatureDto>> {
    const rlt = await this.featureRepository.getByEnvIdAndProjectId(
      u.environmentId,
      u.projectId,
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
}
