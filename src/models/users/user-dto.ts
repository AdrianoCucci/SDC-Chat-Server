import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { Role } from "../auth/role";
import { OrganizationDto } from "../organizations/organization-dto";

export class UserDto {
  id?: number;

  @IsString()
  public username: string;

  @IsEnum(Role)
  public role: Role;

  @IsString()
  @IsOptional()
  public displayName?: string;

  @IsBoolean()
  @IsOptional()
  public isLocked?: boolean;

  @IsBoolean()
  @IsOptional()
  public isOnline?: boolean;

  @IsInt()
  @IsPositive()
  @IsOptional()
  public organizationId?: number;

  public organization?: OrganizationDto;
}