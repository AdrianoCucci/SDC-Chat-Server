import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryBase } from "src/utils/repository-base";
import { Repository } from "typeorm";
import { Room } from "./entities/room.entity";

@Injectable()
export class RoomsService extends RepositoryBase<Room> {
  constructor(@InjectRepository(Room) repository: Repository<Room>) {
    super(repository);
  }
}
