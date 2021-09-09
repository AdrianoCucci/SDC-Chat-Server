import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Role } from "../auth/role";

export class UserRequest {
  @IsEnum(Role)
  public role: Role;

  @IsString()
  public username: string;

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
  @IsOptional()
  public organizationId?: number;
}