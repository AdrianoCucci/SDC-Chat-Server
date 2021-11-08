import { Injectable } from "@nestjs/common";
import { UserPassword } from "src/models/auth/user-password";
import { ServiceBase } from "src/utils/service-base";

@Injectable()
export class UserPasswordsService extends ServiceBase<UserPassword> {
  constructor() {
    super("id", [
      new UserPassword({ id: 1, value: "12345", salt: "", userId: 1 }),
      new UserPassword({ id: 2, value: "12345", salt: "", userId: 2 }),
      new UserPassword({ id: 3, value: "12345", salt: "", userId: 3 }),
      new UserPassword({ id: 4, value: "12345", salt: "", userId: 4 }),
      new UserPassword({ id: 5, value: "12345", salt: "", userId: 5 })
    ]);
  }

  public async getByUserId(userId: number): Promise<UserPassword> {
    return this.findEntity((u: UserPassword) => u.userId === userId);
  }
}