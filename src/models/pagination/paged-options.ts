import { Paginatable } from "./paginatable";
import appConfig from "src/app.config";

export class PagedOptions implements Paginatable {
  public static get default(): PagedOptions {
    return { skip: 0, take: appConfig.paginationMaxTakeCount };
  }

  public skip?: number;
  public take?: number;
}