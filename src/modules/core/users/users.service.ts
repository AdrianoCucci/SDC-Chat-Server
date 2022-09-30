import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryBase } from "src/utils/repository-base";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService extends RepositoryBase<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  public getByUsername(username: string): Promise<User> {
    return this.getOneByModel({ username });
  }

  public usernameExists(username: string): Promise<boolean> {
    return this.hasAnyWithModel({ username });
  }
}
