import { Message } from "../models/messages/message";
import { UserMessage } from "../models/messages/user-message";
import { User } from "../models/users/user";
import { InMemoryDbSet } from "./in-memory-db-set";
import { IDbContext } from "./interfaces/db-context";

export class InMemoryDbContext implements IDbContext {
  public readonly users = new InMemoryDbSet<User>("Users");
  public readonly messages = new InMemoryDbSet<Message>("Messages");
  public readonly usersMessages = new InMemoryDbSet<UserMessage>("UsersMessages");

  public constructor() {
    this.users.add({ userId: 1, username: "admin", password: "12345", displayName: "Admin", isOnline: true });
    this.users.add({ userId: 2, username: "user123", password: "12345", displayName: "Display Name", isOnline: false });
    this.users.add({ userId: 3, username: "user456", password: "12345", displayName: "Display Name One", isOnline: true });
    this.users.add({ userId: 4, username: "user789", password: "12345", displayName: "Display Name Two", isOnline: false });
    this.users.commit();
  }
}