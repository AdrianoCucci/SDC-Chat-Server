import { Type } from "class-transformer";
import { IsInt, IsPositive, IsOptional } from "class-validator";
import { Room } from "./room";

export class RoomParams {
  public static getPredicate(params: RoomParams): (room: Room) => boolean {
    let predicate: (room: Room) => boolean = null;

    if(params != null) {
      predicate = (room: Room) => {
        let filter: boolean = true;

        if(params.organizationId != null) {
          filter = room.organizationId === params.organizationId;
        }

        return filter;
      }
    }

    return predicate;
  }

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public organizationId?: number;
}