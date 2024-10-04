import { ApiProperty } from '@nestjs/swagger';
import {IPaginatedResponseDto} from "@abflags/shared";

export class PaginatedResponseDto<T> implements IPaginatedResponseDto<T> {
  @ApiProperty({
    description: 'The current page of the paginated response',
  })
  page: number;

  total: number;

  @ApiProperty({
    description: 'Number of items on each page',
  })
  pageSize: number;

  @ApiProperty({
    description: 'The list of items matching the query',
    isArray: true,
    type: Object,
  })
  data: T[];
}
