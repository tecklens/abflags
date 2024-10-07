import {Between, DataSource, FindOptionsWhere, In, MoreThanOrEqual, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {FeatureEntity} from "@repository/feature/feature.entity";
import {EnvironmentId, FeatureId, FeatureStatus, ProjectId} from "@abflags/shared";

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
        _environmentId: environmentId,
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

  async countByDate({
                      project,
                      dateAccessor,
                      range,
                      date,
                      archived
                    }: {
    project: ProjectId;
    dateAccessor: string;
    range?: Date[],
    date?: Date,
    archived?: boolean
  }) {
    const conditions: FindOptionsWhere<FeatureEntity> = {
      _projectId: project
    }

    if (date) {
      conditions[dateAccessor] = MoreThanOrEqual(date)
    }

    if (range && range.length === 2) {
      conditions[dateAccessor] = Between(range[0], range[1])
    }

    if (archived) {
      conditions.status = FeatureStatus.ARCHIVE
    } else {
      conditions.status = In([FeatureStatus.ACTIVE, FeatureStatus.INACTIVE])
    }

    return this.countBy(conditions);
  }

  async getFeatureTypeCounts(
    projectId: ProjectId,
    environmentId: EnvironmentId,
    status: FeatureStatus[]
  ) {
    return this.createQueryBuilder()
      .select('type as type, count(type) as cnt')
      .where(`project_id = '${projectId}' and environment_id = '${environmentId}' and status in (:status)`, {status: status})
      .groupBy('type')
      .getRawMany();
  }
}
