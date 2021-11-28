import { Type } from "class-transformer";
import { IsInt, IsPositive, IsOptional } from "class-validator";
import { Room } from "../entities/room.entity";

export class RoomQuery {
  public static getPredicate(query: RoomQuery): (room: Room) => boolean {
    let predicate: (room: Room) => boolean = null;

    if(query != null) {
      predicate = (room: Room) => {
        const filters: boolean[] = [];

        if(query.organizationId != null) {
          filters.push(room.organizationId === query.organizationId);
        }
        if(query.pingSound != null) {
          filters.push(room.pingSound === query.pingSound);
        }

        return !filters.some((f: boolean) => f === false);
      }
    }

    return predicate;
  }

  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  public pingSound?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public organizationId?: number;
}