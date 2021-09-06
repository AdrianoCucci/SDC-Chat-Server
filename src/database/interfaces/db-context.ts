import { ChatMessage } from "../../models/messages/chat-message";
import { UserMessage } from "../../models/messages/user-message";
import { User } from "../../models/users/user";
import { IDbSet } from "./db-set";

export interface IDbContext {
  users: IDbSet<User>;
  messages: IDbSet<ChatMessage>;
  usersMessages: IDbSet<UserMessage>;
}