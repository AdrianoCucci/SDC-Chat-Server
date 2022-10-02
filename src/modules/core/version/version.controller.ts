import { Controller, Get } from "@nestjs/common";
import { VersionService } from "./version.service";

@Controller("version")
export class VersionController {
  constructor(private _versionService: VersionService) {}

  @Get()
  public getVersion(): string {
    return this._versionService.getVersion();
  }
}
