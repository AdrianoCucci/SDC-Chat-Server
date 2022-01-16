import { Paginatable } from "./paginatable";

export type PagedModel<T> = { [P in keyof T]?: T[P]; } & Paginatable;