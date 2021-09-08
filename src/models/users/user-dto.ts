import { RoleType } from "../auth/role-type";
import { OrganizationDto } from "../organizations/organization-dto";

export interface UserDto {
  id?: number;
  role: RoleType;
  username: string;
  displayName?: string;
  isOnline: boolean;
  organizationId?: number;
  
  organization?: OrganizationDto;
}