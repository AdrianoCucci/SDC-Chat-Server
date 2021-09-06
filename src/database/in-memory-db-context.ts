import { RoleType } from "../models/auth/role-type";
import { ChatMessage } from "../models/messages/chat-message";
import { UserMessage } from "../models/messages/user-message";
import { User } from "../models/users/user";
import { InMemoryDbSet } from "./in-memory-db-set";
import { IDbContext } from "./interfaces/db-context";

export class InMemoryDbContext implements IDbContext {
  public readonly users = new InMemoryDbSet<User>("Users");
  public readonly messages = new InMemoryDbSet<ChatMessage>("Messages");
  public readonly usersMessages = new InMemoryDbSet<UserMessage>("UsersMessages");

  public constructor() {
    this.users.add({ userId: 1, role: RoleType.Administrator, username: "admin", password: "12345", displayName: "Admin", isOnline: false });
    this.users.add({ userId: 2, role: RoleType.User, username: "user123", password: "12345", displayName: "Display Name", isOnline: false });
    this.users.add({ userId: 3, role: RoleType.User, username: "user456", password: "12345", displayName: "Display Name One", isOnline: false });
    this.users.add({ userId: 4, role: RoleType.User, username: "user789", password: "12345", displayName: "Display Name Two", isOnline: false });
    this.users.commit();
  }
}