import { Message } from "../models/messages/message";
import { UserMessage } from "../models/messages/user-message";
import { User } from "../models/user";
import { DbSet } from "./db-set";

export class DbContext {
  public readonly users = new DbSet<User>("Users");
  public readonly messages = new DbSet<Message>("Messages");
  public readonly usersMessages = new DbSet<UserMessage>("UsersMessages");
}