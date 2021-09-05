import { Message } from "../../models/messages/message";
import { UserMessage } from "../../models/messages/user-message";
import { User } from "../../models/users/user";
import { IDbSet } from "./db-set";

export interface IDbContext {
  users: IDbSet<User>;
  messages: IDbSet<Message>;
  usersMessages: IDbSet<UserMessage>;
}