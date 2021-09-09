import { Role } from "../auth/role";
import { Organization } from "../organizations/organization";

export interface User {
  id: number;
  role: Role;
  username: string;
  displayName?: string;
  isOnline: boolean;
  organizationId?: number;
  
  organization?: Organization;
}