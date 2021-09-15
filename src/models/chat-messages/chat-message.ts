import { User } from "../users/user";

export class ChatMessage {
  public id: number;
  public contents: string;
  public datePosted: Date | string;
  public senderUserId: number;
  public organizationId?: number

  public senderUser?: User;
}