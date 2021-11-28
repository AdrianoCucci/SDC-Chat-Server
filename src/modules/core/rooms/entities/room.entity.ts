import { Organization } from "../../organizations/entities/organization.entity";

export class Room {
  public id: number;
  public name: string;
  public number?: number;
  public description?: string;
  public pingSound?: number;
  public organizationId: number;

  public organization?: Organization;

  public constructor(values?: Partial<Room>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}