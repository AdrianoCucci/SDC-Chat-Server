import { User } from "../../users/entities/user.entity";

export class ChatMessage {
  public id: number;
  public contents: string;
  public datePosted: Date | string;
  public senderUserId: number;
  public organizationId?: number

  public senderUser?: User;

  public constructor(values?: Partial<ChatMessage>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}