import { Role } from "../auth/role";
import { Organization } from "../organizations/organization";

export class User {
  public id: number = null;
  public role: Role = Role.User;
  public username: string = null;
  public password: string = null;
  public displayName?: string = null;
  public isOnline?: boolean = false;
  public organizationId?: number = null;
  
  public organization?: Organization = null;
}