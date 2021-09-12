import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive } from "class-validator";
import { Role } from "../auth/role";
import { User } from "./user";

export class UserParams {
  public static getPredicate(params: UserParams): (user: User) => boolean {
    let predicate: (user: User) => boolean;

    if(params == null) {
      predicate = () => true;
    }
    else {
      predicate = (user: User) => {
        const filters: boolean[] = [];

        if(params.role != null) {
          filters.push(user.role === params.role);
        }
        if(params.isOnline != null) {
          filters.push(user.isOnline === params.isOnline);
        }
        if(params.organizationId != null) {
          filters.push(user.organizationId === params.organizationId);
        }

        return !filters.some((m: boolean) => m === false);
      }
    }

    return predicate;
  }

  @Type(() => Number)
  @IsEnum(Role)
  @IsOptional()
  public role?: Role;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  public isOnline?: boolean;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public organizationId?: number;
}