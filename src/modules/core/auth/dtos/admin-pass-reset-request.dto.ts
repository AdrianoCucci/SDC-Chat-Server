import { IsInt, IsPositive, IsString } from "class-validator";

export class AdminPassResetRequest {
  @IsInt()
  @IsPositive()
  public userId: number;

  @IsString()
  public newPassword: string;
}
