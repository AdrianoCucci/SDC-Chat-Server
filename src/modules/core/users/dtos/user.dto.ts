import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { Role } from "src/models/auth/role";
import { ChatMessageDto } from "../../chat-messages/dtos/chat-message.dto";
import { OrganizationDto } from "../../organizations/dtos/organization.dto";

export class UserDto {
  public id?: number;

  @IsString()
  public username: string;

  @IsEnum(Role)
  public role: Role;

  @IsString()
  public password?: string;

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

  @IsOptional()
  public preferencesJson?: string;

  public organization?: OrganizationDto;
  public chatMessages?: ChatMessageDto[];
}