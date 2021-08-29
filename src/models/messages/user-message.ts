import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { User } from "../user";

export interface UserMessage {
  userMessageId: number;
  userId: number;
  messageId: number;
  isRead: boolean;

  message?: Message;
  user?: User;
}