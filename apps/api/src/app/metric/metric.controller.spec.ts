import { Test, TestingModule } from '@nestjs/testing';
import { MetricController } from './metric.controller';

describe('MetricController', () => {
  let controller: MetricController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricController],
    }).compile();

    controller = module.get<MetricController>(MetricController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
