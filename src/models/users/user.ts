import { RoleType } from "../auth/role-type";

export interface User {
  userId?: number;
  username: string;
  password: string;
  role: RoleType;
  displayName?: string;
  isOnline: boolean;
}