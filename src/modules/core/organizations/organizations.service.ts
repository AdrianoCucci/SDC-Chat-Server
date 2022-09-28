import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryBase } from "src/utils/repository-base";
import { Repository } from "typeorm";
import { Organization } from "./entities/organization.entity";

@Injectable()
export class OrganizationsService extends RepositoryBase<Organization> {
  constructor(
    @InjectRepository(Organization) repository: Repository<Organization>
  ) {
    super(repository);
  }
}
