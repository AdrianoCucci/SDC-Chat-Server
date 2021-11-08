import { Injectable } from '@nestjs/common';
import { Role } from 'src/models/auth/role';
import { User } from 'src/models/users/user';
import { UserParams } from 'src/models/users/user-params';
import { ServiceBase } from 'src/utils/service-base';

@Injectable()
export class UsersService extends ServiceBase<User> {
  constructor() {
    super("id",
      [
        new User({ id: 1, role: Role.Administrator, username: "admin", displayName: "Admin", isOnline: false }),
        new User({ id: 2, role: Role.OrganizationAdmin, username: "orgadmin1", displayName: "Org Admin 1", isOnline: false, organizationId: 1 }),
        new User({ id: 3, role: Role.User, username: "user1", displayName: "User 1", isOnline: false, organizationId: 1 }),
        new User({ id: 4, role: Role.OrganizationAdmin, username: "orgadmin2", displayName: "Org Admin 2", isOnline: false, organizationId: 2 }),
        new User({ id: 5, role: Role.User, username: "user2", displayName: "User 2", isOnline: false, organizationId: 2 })
      ]
    );
  }

  public async getAll(params?: UserParams): Promise<User[]> {
    const predicate = UserParams.getPredicate(params);
    return this.findEntities(predicate);
  }

  public async getByUsername(username: string): Promise<User> {
    return this.findEntity((u: User) => u.username === username);
  }

  public async usernameExists(username: string): Promise<boolean> {
    return this.entityExists((u: User) => u.username === username);
  }
}