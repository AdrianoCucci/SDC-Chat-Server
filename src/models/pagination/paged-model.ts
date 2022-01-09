import { Paginatable } from "./paginatable";

export type PagedModel<T> = { [p in keyof T]; } & Paginatable;