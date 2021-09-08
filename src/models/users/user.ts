import { RoleType } from "../auth/role-type";

export interface User {
  id: number;
  role: RoleType;
  username: string;
  password: string;
  displayName?: string;
  isOnline: boolean;
  organizationId?: number;
}