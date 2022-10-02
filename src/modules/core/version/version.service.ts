import { Injectable } from "@nestjs/common";
import appConfig from "src/app.config";

@Injectable()
export class VersionService {
  public getVersion(): string {
    return appConfig.version;
  }
}
