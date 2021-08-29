import { User } from "../user";

export interface Message {
  messageId: number;
  body: string;
  datePosted: Date | string;
  senderUserId: number;

  sender?: User;
}