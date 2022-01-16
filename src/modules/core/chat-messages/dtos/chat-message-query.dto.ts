import { IsDateString, IsOptional } from "class-validator";
import { Includable } from "src/models/includable";
import { PartialChatMessageDto } from "./partial-chat-message.dto";

export class ChatMessageQueryDto extends PartialChatMessageDto implements Includable {
  @IsDateString()
  @IsOptional()
  public minDate?: Date | string;

  @IsDateString()
  @IsOptional()
  public maxDate?: Date | string;

  @IsOptional()
  public include?: string;
}