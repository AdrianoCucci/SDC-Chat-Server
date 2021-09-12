import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { Role } from "../auth/role";

export class UserRequest {
  @IsString()
  @IsOptional()
  public username?: string;

  @IsEnum(Role)
  @IsOptional()
  public role?: Role;

  @IsString()
  @IsOptional()
  public password?: string;

  @IsString()
  @IsOptional()
  public displayName?: string;

  @IsBoolean()
  @IsOptional()
  public isOnline?: boolean;

  @IsInt()
  @IsPositive()
  @IsOptional()
  public organizationId?: number;
}