import { ChatMessage } from "../../models/messages/chat-message";
import { UserMessage } from "../../models/messages/user-message";
import { Organization } from "../../models/organizations/organization";
import { Room } from "../../models/rooms/room";
import { User } from "../../models/users/user";
import { IDbSet } from "./db-set";

export interface IDbContext {
  users: IDbSet<User>;
  organizations: IDbSet<Organization>;
  rooms: IDbSet<Room>;
  messages: IDbSet<ChatMessage>;
  usersMessages: IDbSet<UserMessage>;
}