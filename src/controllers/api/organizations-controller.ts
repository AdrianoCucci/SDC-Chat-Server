import { Application } from "express";
import { IDbContext } from "../../database/interfaces/db-context";
import { Organization } from "../../models/organizations/organization";
import { OrganizationDto } from "../../models/organizations/organization-dto";
import { MapperService } from "../../services/mapper-service";
import { ApiControllerError } from "../../utils/api-controller-error";
import { handleApiControllerError } from "../../utils/handle-api-controller-error";
import { requireAdministrator } from "../middlewares/require-authorizations";
import { IApiController } from "../interfaces/api-controller";
import { requireBody } from "../middlewares/require-body";

export class OrganizationsController implements IApiController {
  private readonly _route: string = "/api/organizations";
  private readonly _context: IDbContext;
  private readonly _mapper: MapperService;

  public constructor(context: IDbContext, mapper: MapperService) {
    this._context = context;
    this._mapper = mapper;
  }

  public configure(expressApp: Application) {
    expressApp.get(this._route, requireAdministrator, async (request, response) => {
      const organizations: Organization[] = await this._context.organizations.getAll();
      const dtos: OrganizationDto[] = this._mapper.organizations.toDtoArray(organizations);

      response.status(200).json(dtos);
    });

    expressApp.post(this._route, requireAdministrator, requireBody, async (request, response) => {
      try {
        const dtoRequest: OrganizationDto = request.body;

        const entity: Organization = this._mapper.organizations.toEntity(dtoRequest);
        this._context.organizations.add(entity);
        await this._context.organizations.commit();

        const dtoResponse: OrganizationDto = this._mapper.organizations.toDto(entity);
        response.status(200).send(dtoResponse);
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });

    expressApp.put(`${this._route}/:id`, requireAdministrator, requireBody, async (request, response) => {
      try {
        const dtoRequest: OrganizationDto = request.body;

        const id: number = Number(request.params.id);
        const organization: Organization = await this._context.organizations.getById(id);
        if(organization == null) {
          throw new ApiControllerError(404, `Organization with ID does not exist: ${id}`);
        }

        Object.assign(organization, dtoRequest);

        this._context.organizations.update(id, organization);
        await this._context.organizations.commit();

        response.status(200).json(organization);
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });

    expressApp.delete(`${this._route}/:id`, requireAdministrator, async (request, response) => {
      try {
        const id: number = Number(request.params.id);
        const organizationExists: boolean = await this._context.organizations.hasEntity(id);

        if(!organizationExists) {
          throw new ApiControllerError(404, `Organization with ID does not exist: ${id}`);
        }

        this._context.organizations.delete(id);
        await this._context.organizations.commit();

        response.status(200).send("Organization deleted successfully");
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });
  }
}