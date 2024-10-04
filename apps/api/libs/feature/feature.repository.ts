import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {FeatureEntity} from "@repository/feature/feature.entity";
import {EnvironmentId, FeatureId, ProjectId, UserId} from "@abflags/shared";

@Injectable()
export class FeatureRepository extends Repository<FeatureEntity> {
  constructor(private dataSource: DataSource) {
    super(FeatureEntity, dataSource.createEntityManager());
  }

  async getByEnvIdAndProjectId(
    environmentId: EnvironmentId,
    projectId: ProjectId,
    skip: number,
    take: number,
  ) {
    return this.findAndCount({
      where: {
        _projectId: projectId,
        _environmentId: environmentId
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    })
  }

  async getByEnvironmentIdAndId(environmentId: EnvironmentId, id: FeatureId) {
    return this.findOneBy({
      _id: id,
      _environmentId: environmentId,
    })
  }
}
