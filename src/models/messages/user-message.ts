import { User } from "../users/user";
import { ChatMessage } from "./chat-message";

export interface UserMessage {
  userMessageId: number;
  userId: number;
  messageId: number;
  isRead: boolean;

  message?: ChatMessage;
  user?: User;
}