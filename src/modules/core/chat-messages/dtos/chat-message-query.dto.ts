import { IsOptional } from "class-validator";
import { Includable } from "src/models/includable";
import { PartialChatMessageDto } from "./partial-chat-message.dto";

export class ChatMessageQueryDto extends PartialChatMessageDto implements Includable {
  @IsOptional()
  public include?: string;
}