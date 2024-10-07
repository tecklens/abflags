import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {ProjectStatsEntity} from "@repository/project-stats/project-stats.entity";
import {ProjectId} from "@abflags/shared";

@Injectable()
export class ProjectStatsRepository extends Repository<ProjectStatsEntity> {
  constructor(private dataSource: DataSource) {
    super(ProjectStatsEntity, dataSource.createEntityManager());
  }

  async getFirstByProjectId(projectId: ProjectId) {
    return this.findOneBy({
      _projectId: projectId,
    })
  }
}
