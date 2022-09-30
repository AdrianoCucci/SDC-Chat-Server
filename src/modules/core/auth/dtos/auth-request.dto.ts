import { IsString } from "class-validator";

export class AuthRequest {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}
