import { AudioSound } from "../audio-sound";
import { Organization } from "../organizations/organization";

export class Room {
  public id: number;
  public name: string;
  public number?: number;
  public description?: string;
  public pingSound?: AudioSound;
  public organizationId: number;

  public organization?: Organization;

  public constructor(values?: Partial<Room>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}