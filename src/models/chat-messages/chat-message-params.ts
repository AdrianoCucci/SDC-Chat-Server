import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsPositive } from "class-validator";
import { ChatMessage } from "./chat-message";

export class ChatMessageParams {
  public static getPredicate(params: ChatMessageParams): (message: ChatMessage) => boolean {
    let predicate: (message: ChatMessage) => boolean;

    if(params == null) {
      predicate = () => true;
    }
    else {
      predicate = (message: ChatMessage) => {
        const filters: boolean[] = [];

        if(params.minDate != null) {
          filters.push(new Date(message.datePosted) >= new Date(params.minDate));
        }
        if(params.maxDate != null) {
          filters.push(new Date(message.datePosted) >= new Date(params.maxDate));
        }
        if(params.senderUserId != null) {
          filters.push(message.senderUserId === params.senderUserId);
        }
        if(params.organizationId != null) {
          filters.push(message.organizationId === params.organizationId);
        }

        return !filters.some((m: boolean) => m === false);
      }
    }

    return predicate;
  }

  @IsDateString()
  @IsOptional()
  minDate?: Date | string;

  @IsDateString()
  @IsOptional()
  maxDate?: Date | string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  senderUserId?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  organizationId?: number;
}