import {ClientMetricDto} from "@app/metric/dtos/client-metric.dto";

export class BucketMetric {
  features: {
    [key: string]: ClientMetricDto;
  };
  start: Date;
  end: Date;
}
