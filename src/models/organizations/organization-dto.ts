import { IsString } from "class-validator";

export class OrganizationDto {
  public id?: number;

  @IsString()
  public name: string;
  
  @IsString()
  public email: string;

  @IsString()
  public phoneNumber: string;

  @IsString()
  public street: string;
  
  @IsString()
  public city: string;
  
  @IsString()
  public province: string;

  @IsString()
  public country: string;
  
  @IsString()
  public postalCode: string;
}