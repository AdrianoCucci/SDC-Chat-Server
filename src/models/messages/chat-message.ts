import { UserDto } from "../users/user-dto";

export interface ChatMessage {
  id: number;
  contents: string;
  datePosted: Date | string;
  senderUserId: number;

  sender?: UserDto;
}