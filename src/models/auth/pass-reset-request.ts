import { IsString } from "class-validator";

export class PassResetRequest {
  @IsString()
  public currentPassword: string;

  @IsString()
  public newPassword: string;
}