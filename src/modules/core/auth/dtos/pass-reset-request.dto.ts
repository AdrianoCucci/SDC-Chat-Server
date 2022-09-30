import { IsInt, IsPositive, IsString } from "class-validator";

export class PassResetRequest {
  @IsInt()
  @IsPositive()
  public userId: number;

  @IsString()
  public currentPassword: string;

  @IsString()
  public newPassword: string;
}
