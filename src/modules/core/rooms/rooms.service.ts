import { Injectable } from '@nestjs/common';
import { Room } from 'src/models/rooms/room';
import { RoomParams } from 'src/models/rooms/room-params';
import { ServiceBase } from 'src/utils/service-base';

@Injectable()
export class RoomsService extends ServiceBase<Room> {
  constructor() {
    super("id",
      [
        new Room({
          id: 1,
          name: "Operating Room",
          description: "Sample text description...",
          number: 261,
          organizationId: 1
        })
      ]
    );
  }

  public async getAll(params?: RoomParams): Promise<Room[]> {
    const predicate = RoomParams.getPredicate(params);
    return this.findEntities(predicate);
  }
}