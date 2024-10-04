import {DataSource, In, Repository} from "typeorm";
import {ProjectEntity} from "@repository/project/project.entity";
import {ProjectId} from "@abflags/shared";
import {Injectable} from "@nestjs/common";

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
  constructor(private dataSource: DataSource) {
    super(ProjectEntity, dataSource.createEntityManager());
  }

  async findByProjectIdIn(projectIds: ProjectId[]) {
    return this.findBy({
      _id: In(projectIds)
    })
  }

  async findById(projectId: ProjectId) {
    return this.findOneBy({
      _id: projectId
    })
  }
}
