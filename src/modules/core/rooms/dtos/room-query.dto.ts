import { IsOptional } from "class-validator";
import { Includable } from "src/models/includable";
import { PartialRoomDto } from "./partial-room.dto";

export class RoomQueryDto extends PartialRoomDto implements Includable {
  @IsOptional()
  public include?: string;
}