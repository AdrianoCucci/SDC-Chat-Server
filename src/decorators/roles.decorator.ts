import { SetMetadata } from "@nestjs/common";
import { Role } from "src/models/auth/role";

export const ROLES_META_KEY: string = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_META_KEY, roles);