import { Paginatable } from "./paginatable";

export class PaginateMeta implements Paginatable {
  public readonly skip?: number;
  public readonly take?: number;

  public readonly itemsCount: number;
  public readonly totalItemsCount: number;

  public readonly currentPage: number;
  public readonly totalPages: number;

  public readonly hasNext: boolean;
  public readonly hasPrevious: boolean;

  public constructor(pagination: Paginatable, itemsCount: number, totalItemsCount: number) {
    this.skip = Math.abs(Number(pagination.skip ?? 0));
    this.take = Math.abs(Number(pagination.take ?? 100));
    this.itemsCount = Math.abs(Number(itemsCount ?? 0));
    this.totalItemsCount = Math.abs(Number(totalItemsCount ?? 0));

    this.currentPage = Math.ceil((this.skip + this.take) / this.take);
    this.totalPages = Math.ceil(this.totalItemsCount / this.take);

    this.hasNext = this.skip > 0 && (this.skip + this.take < this.totalItemsCount || this.itemsCount < this.totalItemsCount);
    this.hasPrevious = this.skip + this.take < this.totalItemsCount;
  }
}