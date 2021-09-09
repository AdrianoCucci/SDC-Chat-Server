import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/models/auth/role';
import { User } from 'src/models/users/user';

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
    return this._users || [];
  }

  public async getById(id: number): Promise<User> {
    const user: User = this._users.find((u: User) => u.id === id);

    if(user == null) {
      throw this.idNotFound(id);
    }

    return user;
  }

  public async idExists(id: number): Promise<boolean> {
    return this._users.findIndex((u: User) => u.id === id) !== -1;
  }

  public async add(user: User): Promise<User> {
    user.id = this._nextId;

    this._users.push(user);
    this._nextId++;

    return user;
  }

  public async update(id: number, user: User): Promise<User> {
    const existingUser: User = await this.getById(id);

    if(existingUser == null) {
      throw this.idNotFound(id);
    }

    const index: number = this._users.indexOf(existingUser);
    this._users[index] = Object.assign(existingUser, user);

    return existingUser;
  }

  public async delete(id: number): Promise<boolean> {
    const user: User = await this.getById(id);

    if(user == null) {
      throw this.idNotFound(id);
    }

    const index: number = this._users.indexOf(user);
    this._users.splice(index, 1);

    return true;
  }

  private idNotFound(id: number): NotFoundException {
    return new NotFoundException(`User with ID does not exist: ${id}`);
  }
}