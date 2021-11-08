import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

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

  @Expose()
  @Exclude({ toClassOnly: true })
  public get fullAddress(): string {
    let address: string = "";

    if(this.street) {
      address += `${this.street}, `;
    }
    if(this.city) {
      address += `${this.city}, `;
    }
    if(this.province) {
      address += `${this.province}, `;
    }
    if(this.country) {
      address += `${this.country} `;
    }
    if(this.postalCode) {
      address += `${this.postalCode}`;
    }

    //Remove any leading/trailing commas.
    const commaTrimExp: RegExp = /(^,+)|(,+$)/g

    return address
      .trim()
      .replace(commaTrimExp, '');
  }
}