import { PartialType } from "@nestjs/mapped-types";
import { IsDateString, IsOptional } from "class-validator";
import { ChatMessageDto } from "./chat-message.dto";

export class ChatMessageQueryDto extends PartialType(ChatMessageDto) {
  @IsDateString()
  @IsOptional()
  public minDate?: Date | string;

  @IsDateString()
  @IsOptional()
  public maxDate?: Date | string;

  @IsOptional()
  public include?: string;
}