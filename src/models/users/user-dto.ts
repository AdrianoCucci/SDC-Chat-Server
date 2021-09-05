import { RoleType } from "../auth/role-type";

export interface UserDto {
  userId?: number;
  username: string;
  role: RoleType;
  displayName?: string;
  isOnline: boolean;
}