import { Injectable } from "@nestjs/common";
import { UserPassword } from "src/models/auth/user-password";
import { ServiceBase } from "src/utils/service-base";

@Injectable()
export class UserPasswordsService extends ServiceBase<UserPassword> {
  constructor() {
    super("id", [
      new UserPassword({ userId: 1, value: "12345", salt: "" }),
      new UserPassword({ userId: 2, value: "12345", salt: "" }),
      new UserPassword({ userId: 3, value: "12345", salt: "" }),
      new UserPassword({ userId: 4, value: "12345", salt: "" }),
      new UserPassword({ userId: 5, value: "12345", salt: "" })
    ]);
  }

  public async getByUserId(userId: number): Promise<UserPassword> {
    return this.findEntity((u: UserPassword) => u.userId === userId);
  }
}