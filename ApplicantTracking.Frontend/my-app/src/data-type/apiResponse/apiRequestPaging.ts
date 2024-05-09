export type ApiPagingRequest = {
  pageNumber?: number | 1
  pageSize?: number | 20
  sidx?: string
  sortv?: string | 'asc'
  keywords?: string
}
