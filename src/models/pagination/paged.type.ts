import { Paginatable } from "./paginatable";

export type Paged<T> = { [P in keyof T]?: T[P]; } & Paginatable;