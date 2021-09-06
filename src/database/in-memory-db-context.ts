import { RoleType } from "../models/auth/role-type";
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
    this.users.add({ userId: 1, role: RoleType.Administrator, username: "admin", password: "12345", displayName: "Admin", });
    this.users.add({ userId: 2, role: RoleType.User, username: "user123", password: "12345", displayName: "Display Name", });
    this.users.add({ userId: 3, role: RoleType.User, username: "user456", password: "12345", displayName: "Display Name One", });
    this.users.add({ userId: 4, role: RoleType.User, username: "user789", password: "12345", displayName: "Display Name Two", });
    this.users.commit();
  }
}