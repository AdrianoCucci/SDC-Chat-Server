import { IsNotEmpty } from "class-validator";
import { Role } from "../auth/role";

export class UserRequest {
  @IsNotEmpty()
  public role: Role;

  @IsNotEmpty()
  public username: string;

  public password?: string;
  public displayName?: string;
  public isOnline?: boolean;
  public organizationId?: number;
}