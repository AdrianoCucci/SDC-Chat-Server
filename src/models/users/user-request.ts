import { Role } from "../auth/role";

export interface UserRequest {
  role: Role;
  username: string;
  password: string;
  displayName?: string;
  isOnline?: boolean;
  organizationId?: number;
}