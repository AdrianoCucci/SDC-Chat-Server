import { User } from "../user";
import { Message } from "./message";

export interface UserMessage {
  userMessageId: number;
  userId: number;
  messageId: number;
  isRead: boolean;

  message?: Message;
  user?: User;
}