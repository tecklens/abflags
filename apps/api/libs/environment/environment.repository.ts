import {DataSource, IsNull, Repository} from "typeorm";
import {EnvironmentEntity} from "@repository/environment";
import {Injectable} from "@nestjs/common";

@Injectable()
export class EnvironmentRepository extends Repository<EnvironmentEntity> {
  constructor(private dataSource: DataSource) {
    super(EnvironmentEntity, dataSource.createEntityManager());
  }

  async findProjectEnvironments(projectId: string) {
    return this.findBy({
      _projectId: projectId,
    });
  }

  async findByProject(projectId: string) {
    return this.findOneBy({
      _projectId: projectId,
      _parentId: IsNull(),
    });
  }
}
