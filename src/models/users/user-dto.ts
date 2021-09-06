import { RoleType } from "../auth/role-type";

export interface UserDto {
  userId?: number;
  role: RoleType;
  username: string;
  displayName?: string;
}