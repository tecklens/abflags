import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {FeatureStrategyEntity} from "@repository/feature/feature-strategy.entity";
import {FeatureId} from "@abflags/shared";

@Injectable()
export class FeatureStrategyRepository extends Repository<FeatureStrategyEntity> {
  constructor(private dataSource: DataSource) {
    super(FeatureStrategyEntity, dataSource.createEntityManager());
  }

  async countCurrentStrategy(featureId: FeatureId) {
    return this.countBy({
      featureId: featureId,
    })
  }
}
