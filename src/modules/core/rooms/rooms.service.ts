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
          description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam et beatae, odio itaque sunt iusto quae blanditiis dignissimos adipisci accusamus repudiandae facere consequuntur quis ad, ex laboriosam vero delectus ipsam.",
          number: 261,
          organizationId: 1,
          pingSound: 1
        }),
        new Room({
          id: 2,
          name: "Front Desk",
          organizationId: 1,
        }),
        new Room({
          id: 3,
          name: "Cleaning Room",
          description: "Sample text description...",
          number: 186,
          organizationId: 1,
          pingSound: 1
        })
      ]
    );
  }

  public async getAll(params?: RoomParams): Promise<Room[]> {
    const predicate = RoomParams.getPredicate(params);
    return this.findEntities(predicate);
  }
}