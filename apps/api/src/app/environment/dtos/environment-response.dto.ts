import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnvironmentResponseDto {
  @ApiPropertyOptional()
  _id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  _projectId: string;

  @ApiProperty()
  identifier: string;

  @ApiProperty()
  _parentId: string;
}

export interface IApiKeyDto {
  key: string;
  _userId: string;
  _projectId: string;
  hash?: string;
}
