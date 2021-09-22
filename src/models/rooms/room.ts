import { Organization } from "../organizations/organization";
import { RoomPingSound } from "./room-ping-sound";

export class Room {
  public id: number;
  public name: string;
  public number?: number;
  public description?: string;
  public pingSound?: RoomPingSound;
  public organizationId: number;

  public organization?: Organization;

  public constructor(values?: Partial<Room>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}