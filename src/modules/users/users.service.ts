import { Injectable } from '@nestjs/common';
import { Role } from 'src/models/auth/role';
import { User } from 'src/models/users/user';
import { UserRequest } from 'src/models/users/user-request';
import { ServiceError } from 'src/utils/service-error';

@Injectable()
export class UsersService {
  private readonly _users: User[] = [
    { id: 1, role: Role.Administrator, username: "admin", password: "12345", displayName: "Admin", isOnline: false },
    { id: 2, role: Role.User, username: "user123", password: "12345", displayName: "User 123", isOnline: false },
    { id: 3, role: Role.User, username: "user456", password: "12345", displayName: "User 456", isOnline: false }
  ];

  private _nextId: number;

  constructor() {
    const userIds: number[] = this._users.map((u: User) => u.id);
    this._nextId = Math.max(...userIds) + 1;
  }

  public async getAll(): Promise<User[]> {
    return this._users;
  }

  public async getById(id: number): Promise<User> {
    return this._users.find((u: User) => u.id === id);
  }

  public async hasWithId(id: number): Promise<boolean> {
    return this._users.findIndex((u: User) => u.id === id) !== -1;
  }

  public async add(request: UserRequest): Promise<User> {
    const user: User = { ...request } as any;
    user.id = this._nextId;
    user.isOnline = request.isOnline == null ? false : request.isOnline;

    this._users.push(user);
    this._nextId++;

    return user;
  }

  public async update(id: number, request: UserRequest): Promise<User> {
    const user: User = await this.getById(id);

    if(user == null) {
      throw new ServiceError(404, `User with ID does not exist: ${id}`);
    }
    
    const index: number = this._users.indexOf(user);
    this._users[index] = Object.assign(user, request);

    return user;
  }

  public async delete(id: number): Promise<boolean> {
    const user: User = await this.getById(id);

    if(user == null) {
      throw new ServiceError(404, `User with ID does not exist: ${id}`);
    }

    const index: number = this._users.indexOf(user);
    this._users.splice(index, 1);

    return true;
  }
}