import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {VariableEntity} from "@repository/variable/variable.entity";

@Injectable()
export class VariableRepository extends Repository<VariableEntity> {
  constructor(private dataSource: DataSource) {
    super(VariableEntity, dataSource.createEntityManager());
  }
}
