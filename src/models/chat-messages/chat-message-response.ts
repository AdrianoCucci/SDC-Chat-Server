import { UserResponse } from "../users/user-response";

export class ChatMessageResponse {
  public id: number;
  public contents: string;
  public datePosted: Date | string;
  public senderUserId: number;

  public senderUser?: UserResponse;
}