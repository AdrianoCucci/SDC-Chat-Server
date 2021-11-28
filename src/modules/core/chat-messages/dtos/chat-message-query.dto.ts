import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsPositive } from "class-validator";
import { ChatMessage } from "../entities/chat-message.entity";

export class ChatMessageQuery {
  public static getPredicate(query: ChatMessageQuery): (message: ChatMessage) => boolean {
    let predicate: (message: ChatMessage) => boolean = null;

    if(query != null) {
      predicate = (message: ChatMessage) => {
        const filters: boolean[] = [];

        if(query.minDate != null) {
          filters.push(new Date(message.datePosted) >= new Date(query.minDate));
        }
        if(query.maxDate != null) {
          filters.push(new Date(message.datePosted) >= new Date(query.maxDate));
        }
        if(query.senderUserId != null) {
          filters.push(message.senderUserId === query.senderUserId);
        }
        if(query.organizationId != null) {
          filters.push(message.organizationId === query.organizationId);
        }

        return !filters.some((f: boolean) => f === false);
      }
    }

    return predicate;
  }

  @IsDateString()
  @IsOptional()
  public minDate?: Date | string;

  @IsDateString()
  @IsOptional()
  public maxDate?: Date | string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public senderUserId?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public organizationId?: number;
}