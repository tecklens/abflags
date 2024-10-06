import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { FeatureRepository } from '@repository/feature';
import { TypeOrmModule } from '@nestjs/typeorm';

const repositories = [FeatureRepository];
@Module({
  imports: [TypeOrmModule.forFeature(repositories)],
  providers: [FeatureService, ...repositories],
  controllers: [FeatureController],
})
export class FeatureModule {}
