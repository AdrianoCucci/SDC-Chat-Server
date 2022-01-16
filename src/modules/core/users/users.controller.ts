import { Controller, UseGuards, UseInterceptors, ClassSerializerInterceptor, Get, Query, Param, ParseIntPipe, Post, Body, Put, Delete, HttpCode, HttpStatus, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { Includes } from "src/decorators/includes.decorator";
import { RequestUser } from "src/decorators/request-user.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/models/auth/role";
import { PagedList } from "src/models/pagination/paged-list";
import { PagedModel } from "src/models/pagination/paged-model";
import { AuthorizeGuard } from "src/modules/shared/jwt-auth/authorize.guard";
import { MapperService } from "src/modules/shared/mapper/mapper.service";
import { catchEntityColumnNotFound } from "src/utils/controller-utils";
import { generateUserSecret } from "src/utils/hash-utils";
import { OrganizationsService } from "../organizations/organizations.service";
import { UserSecret } from "../user-secrets/entities/user-secret.entity";
import { UserSecretsService } from "../user-secrets/user-secrets.service";
import { PartialUserDto } from "./dtos/partial-user.dto";
import { UserQueryDto } from "./dtos/user-query.dto";
import { UserDto } from "./dtos/user.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Controller("users")
// @UseGuards(AuthorizeGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private _usersService: UsersService,
    private _secretsService: UserSecretsService,
    private _orgService: OrganizationsService,
    private _mapper: MapperService
  ) { }

  @Get()
  public async getAllUsers(@Query() model?: PagedModel<UserQueryDto>, @Includes() includes?: string[]): Promise<PagedList<UserDto>> {
    const { skip, take, include, ...rest } = model;

    const result: PagedList<UserDto> = await catchEntityColumnNotFound(async () => {
      const users: PagedList<User> = await this._usersService.getAllPaged({
        where: rest,
        skip,
        take,
        relations: includes
      });

      const dtos: UserDto[] = this._mapper.users.mapDtos(users.data);
      return new PagedList<UserDto>({ data: dtos, meta: users.pagination });
    });

    return result;
  }

  @Get(":id")
  public async getUserById(@Param("id", ParseIntPipe) id: number, @Includes() includes?: string[]): Promise<UserDto> {
    const user: User = await this.tryGetUserById(id, includes);
    const dto: UserDto = this._mapper.users.mapDto(user);

    return dto;
  }

  @Post()
  @Roles(Role.Administrator, Role.OrganizationAdmin)
  public async postUser(@RequestUser() user: UserDto, @Body() request: UserDto): Promise<UserDto> {
    await this.validatePostModel(user, request);

    let entity: User = this._mapper.users.mapEntity(request);
    entity = await this._usersService.add(entity);

    const secret: UserSecret = await generateUserSecret(entity.id, request.password);
    await this._secretsService.add(secret);

    const dto: UserDto = this._mapper.users.mapDto(entity);
    return dto;
  }

  @Put(":id")
  public async putUser(@RequestUser() user: UserDto, @Param("id", ParseIntPipe) id: number, @Body() request: PartialUserDto): Promise<UserDto> {
    let entity: User = await this.tryGetUserById(id);

    await this.validatePutModel(user, entity, request);

    //Do not change user role unless an administrator is making the request.
    if(user.role !== Role.Administrator) {
      request.role = entity.role;
    }

    this._mapper.users.mapEntity(request, entity);
    entity = await this._usersService.update(entity);

    const dto: UserDto = this._mapper.users.mapDto(entity);
    return dto;
  }

  @Delete(":id")
  @Roles(Role.Administrator, Role.OrganizationAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@RequestUser() user: UserDto, @Param("id", ParseIntPipe) id: number): Promise<void> {
    const entity: User = await this.tryGetUserById(id);

    if(user.id === entity.id) {
      throw new ForbiddenException("You may not delete your own user account");
    }
    else if(user.role !== Role.Administrator && user.organizationId !== entity.organizationId) {
      throw new ForbiddenException("You do not have permission to delete this user");
    }

    await this._usersService.delete(entity);
  }

  private async tryGetUserById(id: number, includes?: string[]): Promise<User> {
    const user: User = await this._usersService.getOneById(id, { relations: includes });

    if(user == null) {
      throw new NotFoundException(`User ID does not exist: ${id}`);
    }

    return user;
  }

  private async validatePostModel(requestUser: UserDto, request: UserDto): Promise<void> {
    const errors: string[] = [];

    if(!request.password) {
      errors.push("password is required");
    }

    //Make sure non-administrators can only add users within their own organization.
    if(requestUser.role !== Role.Administrator) {
      request.organizationId = requestUser.organizationId;
      request.role = Role.User;
    }
    if(await this._usersService.usernameExists(request.username)) {
      errors.push(`username already exists: ${request.username}`);
    }

    //Non-administrators must specify the organization of users.
    if(request.organizationId == null && requestUser.role !== Role.Administrator) {
      errors.push("organizationId is required");
    }
    else if(request.organizationId != null && !await this._orgService.hasAnyWithId(request.organizationId)) {
      errors.push(`organizationId does not exist: ${request.organizationId}`);
    }

    if(errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }

  private async validatePutModel(requestUser: UserDto, entity: User, request: PartialUserDto): Promise<void> {
    const errors: string[] = [];

    //Make sure non-administrators can only update users within their own organization.
    if(requestUser.role !== Role.Administrator) {
      request.organizationId = requestUser.organizationId;
      request.role = Role.User;
    }
    if(request.username) {
      const userByUsername: User = await this._usersService.getByUsername(request.username);

      if(userByUsername != null && userByUsername.id !== entity.id) {
        errors.push(`username already exists: ${request.username}`);
      }
    }

    //Non-administrators must specify the organization of users.
    if(request.organizationId == null && requestUser.role !== Role.Administrator) {
      errors.push("organizationId is required");
    }
    else if(request.organizationId != null && !await this._orgService.hasAnyWithId(request.organizationId)) {
      errors.push(`organizationId does not exist: ${request.organizationId}`);
    }

    if(requestUser.id !== entity.id && (requestUser.role !== Role.Administrator && requestUser.role !== Role.OrganizationAdmin)) {
      errors.push("You may not edit a different user's information");
    }

    if(errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
}