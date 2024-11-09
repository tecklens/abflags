import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsDefined, IsOptional, IsString} from 'class-validator';
import {BucketMetric} from "./bucket-metric.dto";

export class ClientBucketMetricDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  appName: string;
  @ApiProperty()
  @IsString()
  @IsDefined()
  createdAt: Date;

  @ApiPropertyOptional()
  bucket?: BucketMetric;

  @ApiPropertyOptional()
  @IsString()
  instanceId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  os: 'mac-os' | 'android' | 'window' | 'linux' | 'ios';
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  environment: 'browser' | 'backend' | 'web-worker'
}
