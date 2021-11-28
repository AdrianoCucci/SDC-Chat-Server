import { IsDateString, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { UserDto } from "../../users/dtos/user.dto";

export class ChatMessageDto {
  public id?: number;

  @IsString()
  public contents: string;

  @IsDateString()
  @IsOptional()
  public datePosted: Date | string = new Date().toISOString();

  @IsInt()
  @IsPositive()
  public senderUserId: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  public organizationId?: number;

  public senderUser?: UserDto;
}