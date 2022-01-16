import { Controller, UseGuards, UseInterceptors, ClassSerializerInterceptor, Get, Param, ParseIntPipe, Post, Body, Put, Delete, HttpCode, HttpStatus, NotFoundException, Query } from "@nestjs/common";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/models/auth/role";
import { PagedList } from "src/models/pagination/paged-list";
import { PagedModel } from "src/models/pagination/paged-model";
import { AuthorizeGuard } from "src/modules/shared/jwt-auth/authorize.guard";
import { MapperService } from "src/modules/shared/mapper/mapper.service";
import { catchEntityColumnNotFound } from "src/utils/controller-utils";
import { OrganizationDto } from "./dtos/organization.dto";
import { PartialOrganizationDto } from "./dtos/partial-organization.dto";
import { Organization } from "./entities/organization.entity";
import { OrganizationsService } from "./organizations.service";

@Controller("organizations")
@UseGuards(AuthorizeGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class OrganizationsController {
  constructor(private _orgsService: OrganizationsService, private _mapper: MapperService) { }

  @Get()
  public async getAllOrganizations(@Query() model?: PagedModel<PartialOrganizationDto>): Promise<PagedList<OrganizationDto>> {
    const { skip, take, ...rest } = model;

    const result: PagedList<OrganizationDto> = await catchEntityColumnNotFound(async () => {
      const organizations: PagedList<Organization> = await this._orgsService.getAllPaged({ where: rest, skip, take });
      const dtos: OrganizationDto[] = this._mapper.organizations.mapDtos(organizations.data);

      return new PagedList<OrganizationDto>({ data: dtos, meta: organizations.pagination });
    });

    return result;
  }

  @Get(":id")
  public async getOrganizationById(@Param("id", ParseIntPipe) id: number): Promise<OrganizationDto> {
    const entity: Organization = await this.tryGetOrganizationById(id);
    const dto: OrganizationDto = this._mapper.organizations.mapDto(entity);

    return dto;
  }

  @Post()
  @Roles(Role.Administrator)
  public async postOrganization(@Body() request: OrganizationDto): Promise<OrganizationDto> {
    let entity: Organization = this._mapper.organizations.mapEntity(request);
    entity = await this._orgsService.add(entity);

    const response: OrganizationDto = this._mapper.organizations.mapDto(entity);
    return response;
  }

  @Put(":id")
  @Roles(Role.Administrator)
  public async putOrganization(@Param("id", ParseIntPipe) id: number, @Body() request: PartialOrganizationDto): Promise<OrganizationDto> {
    let entity: Organization = await this.tryGetOrganizationById(id);
    this._mapper.organizations.mapEntity(request, entity);

    entity = await this._orgsService.update(entity);

    const response: OrganizationDto = this._mapper.organizations.mapDto(entity);
    return response;
  }

  @Delete(":id")
  @Roles(Role.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteOrganization(@Param("id", ParseIntPipe) id: number): Promise<void> {
    const entity: Organization = await this.tryGetOrganizationById(id);
    await this._orgsService.delete(entity);
  }

  private async tryGetOrganizationById(id: number): Promise<Organization> {
    const organization: Organization = await this._orgsService.getOneById(id);

    if(organization == null) {
      throw new NotFoundException(`Organization ID does not exist: ${id}`);
    }

    return organization;
  }
}