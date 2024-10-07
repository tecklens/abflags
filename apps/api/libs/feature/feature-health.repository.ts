import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {FeatureHealthEntity} from "@repository/feature/feature-health.entity";

@Injectable()
export class FeatureHealthRepository extends Repository<FeatureHealthEntity> {
  constructor(private dataSource: DataSource) {
    super(FeatureHealthEntity, dataSource.createEntityManager());
  }
}
