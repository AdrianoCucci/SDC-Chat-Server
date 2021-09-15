import { UserDto } from "../users/user-dto";

export class ChatMessageResponse {
  public id: number;
  public contents: string;
  public datePosted: Date | string;
  public senderUserId: number;
  public organizationId?: number;

  public senderUser?: UserDto;
}