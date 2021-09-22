import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { AudioSound } from "../audio-sound";
import { OrganizationDto } from "../organizations/organization-dto";

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

  @IsEnum(AudioSound)
  @IsOptional()
  public pingSound?: AudioSound;

  @IsInt()
  @IsPositive()
  public organizationId: number;

  public organization?: OrganizationDto;
}