import { IsOptional } from "class-validator";
import { Includable } from "src/models/includable";
import { PartialOrganizationDto } from "./partial-organization.dto";

export class OrganizationQueryDto extends PartialOrganizationDto implements Includable {
  @IsOptional()
  public include?: string;
}