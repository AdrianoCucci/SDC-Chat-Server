import { Injectable } from '@nestjs/common';
import { ServiceBase } from 'src/utils/service-base';
import { RoomQuery } from './dtos/room-query.dto';
import { Room } from './entities/room.entity';

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
          pingSound: 2
        }),
        new Room({
          id: 2,
          name: "Front Desk",
          organizationId: 1,
          pingSound: 1
        }),
        new Room({
          id: 3,
          name: "Cleaning Room",
          description: "Sample text description...",
          number: 186,
          organizationId: 1
        })
      ]
    );
  }

  public async getAll(query?: RoomQuery): Promise<Room[]> {
    const predicate = RoomQuery.getPredicate(query);
    return this.findEntities(predicate);
  }
}