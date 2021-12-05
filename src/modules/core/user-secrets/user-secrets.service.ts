import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryBase } from "src/utils/repository-base";
import { Repository } from "typeorm";
import { UserSecret } from "./entities/user-secret.entity";

@Injectable()
export class UserSecretsService extends RepositoryBase<UserSecret> {
  constructor(@InjectRepository(UserSecret) repository: Repository<UserSecret>) {
    super(repository);
  }

  public getOneByUserId(userId: number): Promise<UserSecret> {
    return this.getOneByModel({ userId });
  }
}