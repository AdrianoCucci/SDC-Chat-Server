import { RoleType } from "../models/auth/role-type";
import { ChatMessage } from "../models/messages/chat-message";
import { UserMessage } from "../models/messages/user-message";
import { Organization } from "../models/organizations/organization";
import { Room } from "../models/rooms/room";
import { User } from "../models/users/user";
import { InMemoryDbSet } from "./in-memory-db-set";
import { IDbContext } from "./interfaces/db-context";

export class InMemoryDbContext implements IDbContext {
  public readonly users = new InMemoryDbSet<User>("Users");
  public readonly organizations = new InMemoryDbSet<Organization>("Organizations");
  public readonly rooms = new InMemoryDbSet<Room>("Rooms");
  public readonly messages = new InMemoryDbSet<ChatMessage>("Messages");
  public readonly usersMessages = new InMemoryDbSet<UserMessage>("UsersMessages");

  public constructor() {
    this.organizations.add({ id: 1, name: "Sorriso Dental Care", street: "123 Test St.", city: "Toronto", province: "Ontario", country: "Canada", postalCode: "L8B 2K7" });
    this.organizations.commit();

    this.rooms.add({ id: 1, name: "Operating Room", number: 112, description: "Sample text description...", organizationId: 1 });
    this.rooms.commit();

    this.users.add({ id: 1, role: RoleType.Administrator, username: "admin", password: "12345", displayName: "Admin", isOnline: false });
    this.users.add({ id: 2, role: RoleType.User, username: "user123", password: "12345", displayName: "Display Name", isOnline: false, organizationId: 1 });
    this.users.add({ id: 3, role: RoleType.User, username: "user456", password: "12345", displayName: "Display Name One", isOnline: false, organizationId: 1 });
    this.users.add({ id: 4, role: RoleType.User, username: "user789", password: "12345", displayName: "Display Name Two", isOnline: false, organizationId: 1 });
    this.users.commit();
  }
}