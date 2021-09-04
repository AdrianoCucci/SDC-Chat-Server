import { User } from "../user";

export interface Message {
  messageId: number;
  contents: string;
  datePosted: Date | string;
  senderUserId: number;

  sender?: User;
}