import { Injectable } from "@nestjs/common";
import { ServiceBase } from "src/utils/service-base";
import { UserSecret } from "./entities/user-secret.entity";

@Injectable()
export class UserSecretsService extends ServiceBase<UserSecret> {
  constructor() {
    super("id", [
      new UserSecret({ id: 1, password: "$2b$10$38n8HSG4mnKC6tMnkjW11eYokxw8eOBZ.otQsf8LfC9i7TpVgjh5a", salt: "$2b$10$38n8HSG4mnKC6tMnkjW11e", userId: 1 }),
      new UserSecret({ id: 2, password: "$2b$10$ShcZ4K9RhFoNIwaz7mt0re/WZpQRyiVpW7SfJTos/4Zmv.PxlrXHC", salt: "$2b$10$ShcZ4K9RhFoNIwaz7mt0re", userId: 2 }),
      new UserSecret({ id: 3, password: "$2b$10$3KYZypHCPV3Z5gzZgnOivePQzYY8qXk8KgG3KQ5rO0nycx3yeQXRS", salt: "$2b$10$3KYZypHCPV3Z5gzZgnOive", userId: 3 }),
      new UserSecret({ id: 4, password: "$2b$10$J2PwOvs5kfqKQHRj9VFkcu.q5GiQCbDSY2UNQq/5fOw0CvB/Y2q3O", salt: "$2b$10$J2PwOvs5kfqKQHRj9VFkcu", userId: 4 }),
      new UserSecret({ id: 5, password: "$2b$10$/KK9JzMYxZNV3yMuA58Qd.XtrE8IlenhAKaTl/2YhYROPigU8yf.m", salt: "$2b$10$/KK9JzMYxZNV3yMuA58Qd.", userId: 5 })
    ]);
  }

  public async getByUserId(userId: number): Promise<UserSecret> {
    return this.findEntity((u: UserSecret) => u.userId === userId);
  }
}