import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { ChatMessageDto } from "../../chat-messages/dtos/chat-message.dto";
import { RoomDto } from "../../rooms/dtos/room.dto";
import { UserDto } from "../../users/dtos/user.dto";

export class OrganizationDto {
  public id?: number;

  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public phoneNumber?: string;

  @IsString()
  @IsOptional()
  public street?: string;

  @IsString()
  @IsOptional()
  public city?: string;

  @IsString()
  @IsOptional()
  public province?: string;

  @IsString()
  @IsOptional()
  public country?: string;

  @IsString()
  @IsOptional()
  public postalCode?: string;

  public users?: UserDto[];
  public rooms?: RoomDto[];
  public chatMessages?: ChatMessageDto[];

  @Expose()
  @Exclude({ toClassOnly: true })
  public get fullAddress(): string {
    let address: string = "";

    if (this.street) {
      address += `${this.street}, `;
    }
    if (this.city) {
      address += `${this.city}, `;
    }
    if (this.province) {
      address += `${this.province}, `;
    }
    if (this.country) {
      address += `${this.country} `;
    }
    if (this.postalCode) {
      address += `${this.postalCode}`;
    }

    //Remove any leading/trailing commas.
    const commaTrimExp: RegExp = /(^,+)|(,+$)/g;

    return address.trim().replace(commaTrimExp, "");
  }

  //This setter is intentionally left empty to handle DTO mapping for read-only fields.
  public set fullAddress(value: string) {}
}
