import { Paginatable } from "./paginatable";
import { PaginateMeta } from "./paginate-meta";

export class PagedList<T = any> {
  public readonly data: T[];
  public readonly meta: PaginateMeta;

  public constructor(params: PagedListParams<T>) {
    this.data = params.data;

    const meta: PaginateMeta | PagedListCreateMeta = params.meta;
    this.meta = meta instanceof PaginateMeta ? meta : new PaginateMeta(meta.pagination, params.data.length, meta.totalItemsCount);
  }
}

interface PagedListParams<T = any> {
  data: T[];
  meta: PaginateMeta | PagedListCreateMeta;
}

interface PagedListCreateMeta {
  pagination: Paginatable;
  totalItemsCount: number;
}