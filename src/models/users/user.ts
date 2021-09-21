import { Role } from "../auth/role";
import { Organization } from "../organizations/organization";

export class User {
  public id: number;
  public role: Role = Role.User;
  public username: string;
  public password: string;
  public displayName?: string;
  public isOnline: boolean = false;
  public organizationId?: number;
  
  public organization?: Organization;

  public constructor(values?: Partial<User>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}