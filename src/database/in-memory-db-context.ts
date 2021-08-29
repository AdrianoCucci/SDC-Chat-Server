import { Message } from "../models/messages/message";
import { UserMessage } from "../models/messages/user-message";
import { User } from "../models/user";
import { InMemoryDbSet } from "./in-memory-db-set";
import { IDbContext } from "./interfaces/db-context";

export class InMemoryDbContext implements IDbContext {
  public readonly users = new InMemoryDbSet<User>("Users");
  public readonly messages = new InMemoryDbSet<Message>("Messages");
  public readonly usersMessages = new InMemoryDbSet<UserMessage>("UsersMessages");

  public constructor() {
    this.users.add({ userId: 1, username: "admin", firstName: "First", lastName: "Last", isOnline: true });
    this.users.add({ userId: 2, username: "user123", firstName: "First123", lastName: "Last456", isOnline: false });
    this.users.add({ userId: 3, username: "user456", firstName: "First456", lastName: "Last456", isOnline: true });
    this.users.add({ userId: 4, username: "user789", firstName: "First789", lastName: "Last789", isOnline: false });
    this.users.commit();
  }
}