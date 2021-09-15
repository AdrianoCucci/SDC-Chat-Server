import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthorizeGuard } from 'src/modules/shared/jwt-auth/authorize.guard';
import { Role } from 'src/models/auth/role';
import { Organization } from 'src/models/organizations/organization';
import { OrganizationDto } from 'src/models/organizations/organization-dto';
import { OrganizationDtoPartial } from 'src/models/organizations/organization-dto-partial';
import { MapperService } from 'src/modules/shared/mapper/mapper.service';
import { OrganizationsService } from './organizations.service';

@Controller("api/organizations")
@UseGuards(AuthorizeGuard)
export class OrganizationsController {
  constructor(private _orgsService: OrganizationsService, private _mapper: MapperService) { }

  @Get()
  public async getAllOrganizations(): Promise<OrganizationDto[]> {
    const entities: Organization[] = await this._orgsService.getAll();
    const dtos: OrganizationDto[] = this._mapper.organizations.mapDtos(entities);

    return dtos;
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
    const entity: Organization = this._mapper.organizations.mapEntity(request);
    await this._orgsService.add(entity);

    const response: OrganizationDto = this._mapper.organizations.mapDto(entity);
    return response;
  }

  @Put(":id")
  @Roles(Role.Administrator)
  public async putOrganization(@Param("id", ParseIntPipe) id: number, @Body() request: OrganizationDtoPartial): Promise<OrganizationDto> {
    const entity: Organization = await this.tryGetOrganizationById(id);
    this._mapper.organizations.mapEntity(request, entity);

    await this._orgsService.update(entity);

    const response: OrganizationDto = this._mapper.organizations.mapDto(entity);
    return response;
  }

  @Delete(":id")
  @Roles(Role.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteOrganization(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.tryGetOrganizationById(id);
    await this._orgsService.delete(id);
  }

  private async tryGetOrganizationById(id: number): Promise<Organization> {
    const organization: Organization = await this._orgsService.getById(id);

    if(organization == null) {
      throw new NotFoundException(`Organization ID does not exist: ${id}`);
    }

    return organization;
  }
}