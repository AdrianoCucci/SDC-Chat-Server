import { IsString } from "class-validator";

export class AdminPassResetRequest {
  @IsString()
  public newPassword: string;
}