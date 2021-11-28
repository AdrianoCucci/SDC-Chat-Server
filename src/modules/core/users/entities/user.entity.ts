import { Role } from "src/models/auth/role";
import { Organization } from "../../organizations/entities/organization.entity";

export class User {
  public id: number;
  public role: Role = Role.User;
  public username: string;
  public displayName?: string;
  public isLocked: boolean = false;
  public isOnline: boolean = false;
  public organizationId?: number;

  public organization?: Organization;

  public constructor(values?: Partial<User>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}