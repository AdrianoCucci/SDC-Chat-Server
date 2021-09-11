import { UserResponse } from "../users/user-response";

export class AuthResponse {
  public isSuccess: boolean;
  public message?: string;
  public user?: UserResponse;
  public token?: string;
}