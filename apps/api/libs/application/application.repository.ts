import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {ApplicationEntity} from "@repository/application/application.entity";

@Injectable()
export class ApplicationRepository extends Repository<ApplicationEntity> {
  constructor(private dataSource: DataSource) {
    super(ApplicationEntity, dataSource.createEntityManager());
  }
}
