import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class AnalysisMetricDto {
  @ApiProperty()
  @IsString()
  period: string;

  @ApiProperty()
  @IsString()
  featureName: string;
}
