import { Injectable } from '@nestjs/common';
import { Role } from 'src/models/auth/role';
import { User } from 'src/models/users/user';
import { ServiceBase } from 'src/utils/dto-mappings/service-base';

@Injectable()
export class UsersService extends ServiceBase<User> {
  constructor() {
    super("id",
      [
        { id: 1, role: Role.Administrator, username: "admin", password: "12345", displayName: "Admin", isOnline: false },
        { id: 2, role: Role.User, username: "user123", password: "12345", displayName: "User 123", isOnline: false },
        { id: 3, role: Role.User, username: "user456", password: "12345", displayName: "User 456", isOnline: false }
      ]
    );
  }

  public async getByUsername(username: string): Promise<User> {
    return this.findEntity((u: User) => u.username === username);
  }

  public async usernameExists(username: string): Promise<boolean> {
    return this.entityExists((u: User) => u.username === username);
  }
}