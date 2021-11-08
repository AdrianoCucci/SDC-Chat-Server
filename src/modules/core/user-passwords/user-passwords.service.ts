import { Injectable } from "@nestjs/common";
import { UserPassword } from "src/models/auth/user-password";
import { ServiceBase } from "src/utils/service-base";

@Injectable()
export class UserPasswordsService extends ServiceBase<UserPassword> {
  constructor() {
    super("id", [
      new UserPassword({ id: 1, value: "$2b$10$38n8HSG4mnKC6tMnkjW11eYokxw8eOBZ.otQsf8LfC9i7TpVgjh5a", salt: "$2b$10$38n8HSG4mnKC6tMnkjW11e", userId: 1 }),
      new UserPassword({ id: 2, value: "$2b$10$ShcZ4K9RhFoNIwaz7mt0re/WZpQRyiVpW7SfJTos/4Zmv.PxlrXHC", salt: "$2b$10$ShcZ4K9RhFoNIwaz7mt0re", userId: 2 }),
      new UserPassword({ id: 3, value: "$2b$10$3KYZypHCPV3Z5gzZgnOivePQzYY8qXk8KgG3KQ5rO0nycx3yeQXRS", salt: "$2b$10$3KYZypHCPV3Z5gzZgnOive", userId: 3 }),
      new UserPassword({ id: 4, value: "$2b$10$J2PwOvs5kfqKQHRj9VFkcu.q5GiQCbDSY2UNQq/5fOw0CvB/Y2q3O", salt: "$2b$10$J2PwOvs5kfqKQHRj9VFkcu", userId: 4 }),
      new UserPassword({ id: 5, value: "$2b$10$/KK9JzMYxZNV3yMuA58Qd.XtrE8IlenhAKaTl/2YhYROPigU8yf.m", salt: "$2b$10$/KK9JzMYxZNV3yMuA58Qd.", userId: 5 })
    ]);
  }

  public async getByUserId(userId: number): Promise<UserPassword> {
    return this.findEntity((u: UserPassword) => u.userId === userId);
  }
}