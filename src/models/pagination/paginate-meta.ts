import { Paginatable } from "./paginatable";

export class PaginateMeta implements Paginatable {
  public skip?: number;
  public take?: number;
  public itemsCount: number;
  public totalItemsCount: number;

  public constructor(pagination: Paginatable, itemsCount: number, totalItemsCount: number) {
    this.skip = pagination.skip;
    this.take = pagination.take;
    this.itemsCount = itemsCount;
    this.totalItemsCount = totalItemsCount;
  }

  public get currentPage(): number {
    return ((this.skip ?? 0) + (this.take ?? 0)) / this.take ?? 1;
  }

  public get totalPages(): number {
    return Math.ceil(this.totalItemsCount / (this.take ?? 1));
  }

  public get hasNext(): boolean {
    return this.skip > 0 && (this.skip + (this.take ?? 1) < this.totalItemsCount || this.itemsCount < this.totalItemsCount);
  }

  public get hasPrevious(): boolean {
    return (this.skip ?? 0) + (this.take ?? 1) < this.totalItemsCount;
  }
}