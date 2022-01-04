import { Paginatable } from "./paginatable";
import { PaginateMeta } from "./paginate-meta";

export class PagedList<T> {
  public data: T[];
  public meta: PaginateMeta;

  public constructor(data: T[], pagination: Paginatable, totalItemsCount: number) {
    this.data = data;
    this.meta = new PaginateMeta(pagination, data.length, totalItemsCount);
  }
}