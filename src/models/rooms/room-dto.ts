import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { OrganizationDto } from "../organizations/organization-dto";
import { RoomPingSound } from "./room-ping-sound";

export class RoomDto {
  public id?: number;

  @IsString()
  public name: string;

  @IsNumber()
  @IsOptional()
  public number?: number;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsEnum(RoomPingSound)
  @IsOptional()
  public pingSound?: RoomPingSound;

  @IsInt()
  @IsPositive()
  public organizationId: number;

  public organization?: OrganizationDto;
}