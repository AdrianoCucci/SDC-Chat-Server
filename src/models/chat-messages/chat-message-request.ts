import { IsDateString, IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class ChatMessageRequest {
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
}