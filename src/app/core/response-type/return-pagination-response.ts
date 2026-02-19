import { ReturnSearchResponse } from './return-search-response';

export interface ReturnPaginationResponse extends ReturnSearchResponse {
  hasPrevious: boolean;
  hasNext: boolean;
}
