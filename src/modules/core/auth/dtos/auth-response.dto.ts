import { UserDto } from "../../users/dtos/user.dto";

export class AuthResponse {
  public isSuccess: boolean;
  public message?: string;
  public user?: UserDto;
  public token?: string;
}