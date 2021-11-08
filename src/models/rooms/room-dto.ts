import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { OrganizationDto } from "../organizations/organization-dto";

export class RoomDto {
  public id?: number;

  @IsString()
  public name: string;

  @IsNumber()
  @IsOptional()
  public number?: number;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  public pingSound?: number;

  @IsInt()
  @IsPositive()
  public organizationId: number;

  public organization?: OrganizationDto;
}