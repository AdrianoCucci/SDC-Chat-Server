import { OrganizationDto } from "../organizations/organization-dto";

export interface RoomDto {
  id?: number;
  name: string;
  number?: number;
  description?: string;
  organizationId: number;

  organization?: OrganizationDto;
}