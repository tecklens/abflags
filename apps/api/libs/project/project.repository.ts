import {DataSource, FindOptionsWhere, ILike, In, Repository} from "typeorm";
import {ProjectEntity} from "@repository/project/project.entity";
import {ProjectId} from "@abflags/shared";
import {Injectable} from "@nestjs/common";

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
  constructor(private dataSource: DataSource) {
    super(ProjectEntity, dataSource.createEntityManager());
  }

  async findByProjectIdIn(projectIds: ProjectId[], sortType: 'ASC' | 'DESC', name: string) {
    const conditions: FindOptionsWhere<ProjectEntity> = {
      _id: In(projectIds),
    }

    if (name) {
      conditions.name = ILike('%' + name + '%')
    }

    return this.find({
      where: conditions,
      order: {
        createdAt: sortType ?? 'DESC',
      },
      relations: ['owner']
    })
  }

  async findById(projectId: ProjectId) {
    return this.findOneBy({
      _id: projectId
    })
  }

  async existByName(name: string) {
    return this.existsBy({
      name: name
    })
  }
}
