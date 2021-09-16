import { Injectable } from '@nestjs/common';
import { Room } from 'src/models/rooms/room';
import { ServiceBase } from 'src/utils/service-base';

@Injectable()
export class RoomsService extends ServiceBase<Room> {
  constructor() {
    super("id",
      [
        {
          id: 1,
          name: "Operating Room",
          description: "Sample text description...",
          number: 261,
          organizationId: 1
        }
      ]
    );
  }
}