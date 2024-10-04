import {PaginationWithFiltersRequestDto} from "@abtypes/pagination-with-filters-request";

export class GetFeatureRequestDto extends PaginationWithFiltersRequestDto({
  defaultLimit: 10,
  maxLimit: 100,
  queryDescription:
    'It allows filtering based on either the name or trigger identifier of the workflow items.',
}) {
  page: number;
  limit: number;

  status: number[];
}
