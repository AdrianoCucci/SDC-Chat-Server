import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive } from "class-validator";
import { Role } from "src/models/auth/role";
import { User } from "../entities/user.entity";

export class UserQuery {
  public static getPredicate(query: UserQuery): (user: User) => boolean {
    let predicate: (user: User) => boolean = null;

    if(query != null) {
      predicate = (user: User) => {
        const filters: boolean[] = [];

        if(query.role != null) {
          filters.push(user.role === query.role);
        }
        if(query.isLocked != null) {
          filters.push(user.isLocked === query.isLocked);
        }
        if(query.isOnline != null) {
          filters.push(user.isOnline === query.isOnline);
        }
        if(query.organizationId != null) {
          filters.push(user.organizationId === query.organizationId);
        }

        return !filters.some((f: boolean) => f === false);
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
  public isLocked?: boolean;

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