import { Role } from "src/models/auth/role";
import { UserDto } from "src/modules/core/users/dtos/user.dto";
import { User } from "src/modules/core/users/entities/user.entity";

export const userIsInRole = (user: Partial<User | UserDto>, roles: Role[] | Role): boolean => {
  let result: boolean = false;
  const userRole: Role = user?.role;

  if(user && roles) {
    result = Array.isArray(roles)
      ? roles.some((r: Role) => r === userRole)
      : roles === userRole;
  }

  return result;
}