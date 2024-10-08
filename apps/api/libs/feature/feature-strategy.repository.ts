import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {FeatureStrategyEntity} from "@repository/feature/feature-strategy.entity";

@Injectable()
export class FeatureStrategyRepository extends Repository<FeatureStrategyEntity> {
  constructor(private dataSource: DataSource) {
    super(FeatureStrategyEntity, dataSource.createEntityManager());
  }
}
