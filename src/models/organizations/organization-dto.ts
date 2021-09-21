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

  public fullAddress?: string;
}