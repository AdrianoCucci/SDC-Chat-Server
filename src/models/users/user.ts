import { RoleType } from "../auth/role-type";

export interface User {
  userId?: number;
  role: RoleType;
  username: string;
  password: string;
  displayName?: string;
  isOnline: boolean;
}