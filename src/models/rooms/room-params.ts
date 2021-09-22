import { Type } from "class-transformer";
import { IsInt, IsPositive, IsOptional, IsEnum } from "class-validator";
import { AudioSound } from "../audio-sound";
import { Room } from "./room";

export class RoomParams {
  public static getPredicate(params: RoomParams): (room: Room) => boolean {
    let predicate: (room: Room) => boolean = null;

    if(params != null) {
      predicate = (room: Room) => {
        const filters: boolean[] = [];

        if(params.organizationId != null) {
          filters.push(room.organizationId === params.organizationId);
        }
        if(params.pingSound != null) {
          filters.push(room.pingSound === params.pingSound);
        }

        return !filters.some((f: boolean) => f === false);
      }
    }

    return predicate;
  }

  @Type(() => Number)
  @IsEnum(AudioSound)
  @IsOptional()
  public pingSound?: AudioSound;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public organizationId?: number;
}