import {Between, DataSource, FindOptionsWhere, LessThan, Repository} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EventEntity } from '@repository/event/event.entity';
import {EnvironmentId, FeatureId, ProjectId} from "@abflags/shared";

@Injectable()
export class EventRepository extends Repository<EventEntity> {
  constructor(private dataSource: DataSource) {
    super(EventEntity, dataSource.createEntityManager());
  }

  async getEventByFeatureId(
    projectId: ProjectId,
    environmentId: EnvironmentId,
    featureId: FeatureId,
    skip: number,
    take: number,
  ) {
    const conditions: FindOptionsWhere<EventEntity> = {
      _projectId: projectId,
      _environmentId: environmentId,
      featureId: featureId,
    }

    return this.findAndCount({
      where: conditions,
      order: {
        createdAt: 'DESC'
      },
      skip,
      take,
    })
  }

  async getEventByProjectId(
    projectId: ProjectId,
    environmentId: EnvironmentId,
    skip: number,
    take: number,
  ) {
    const conditions: FindOptionsWhere<EventEntity> = {
      _projectId: projectId,
      _environmentId: environmentId,
    }

    return this.findAndCount({
      where: conditions,
      order: {
        createdAt: 'DESC'
      },
      skip,
      take,
    })
  }

  async countByCurrentProjectWindow(projectId: ProjectId, date: Date) {
    return this.countBy({
      _projectId: projectId,
      createdAt: LessThan(date)
    })
  }

  async countByPastProjectWindow(projectId: ProjectId, range: Date[]) {
    if (!range || range.length < 2) return 0;
    return this.countBy({
      _projectId: projectId,
      createdAt: Between(range[0], range[1])
    })
  }
}
