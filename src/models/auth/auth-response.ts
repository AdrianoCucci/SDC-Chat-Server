import { UserDto } from "../users/user-dto";

export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  token?: string;
  user?: UserDto;
}