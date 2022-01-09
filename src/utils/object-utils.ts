import { PagedOptions } from "src/models/pagination/paged-options";

export const stripNonPrototypeFields = <T = object>(obj: T, ...excludedFields: string[]): T => {
  if(obj != null) {
    for(const key in obj) {
      if(!Object.prototype.hasOwnProperty(key) && (!excludedFields?.includes(key) ?? false)) {
        delete obj[key];
      }
    }
  }

  return obj;
}

export const stripNonPrototypeFieldsPaged = <T = object>(obj: T, ...excludedFields: string[]): T => {
  const pagedFields: string[] = Object.keys(PagedOptions.default);

  if(excludedFields != null) {
    excludedFields.push(...pagedFields);
  }
  else {
    excludedFields = [...pagedFields];
  }

  return stripNonPrototypeFields(obj, ...excludedFields);
}