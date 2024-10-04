import {Injectable} from '@nestjs/common';
import {FeatureEntity, FeatureRepository} from "@repository/feature";
import {FeatureId, IJwtPayload, IPaginatedResponseDto} from "@abflags/shared";
import {CreateFeatureRequestDto, FeatureDto, GetFeatureRequestDto} from "@app/feature/dtos";

@Injectable()
export class FeatureService {
  constructor(private readonly featureRepository: FeatureRepository) {
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
}
