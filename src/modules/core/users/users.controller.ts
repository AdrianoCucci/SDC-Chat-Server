import { Body, ClassSerializerInterceptor, ConflictException, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthorizeGuard } from 'src/modules/shared/jwt-auth/authorize.guard';
import { Role } from 'src/models/auth/role';
import { User } from 'src/models/users/user';
import { UserDto } from 'src/models/users/user-dto';
import { UserDtoPartial } from 'src/models/users/user-dto-partial';
import { UserParams } from 'src/models/users/user-params';
import { MapperService } from 'src/modules/shared/mapper/mapper.service';
import { UsersService } from './users.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Controller("api/users")
@UseGuards(AuthorizeGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private _usersService: UsersService, private _orgService: OrganizationsService, private _mapper: MapperService) { }

  @Get()
  public async getAllUsers(@Query() params: UserParams): Promise<UserDto[]> {
    const users: User[] = await this._usersService.getAll(params);
    const dtos: UserDto[] = this._mapper.users.mapDtos(users);

    return dtos;
  }

  @Get(":id")
  public async getUserById(@Param("id", ParseIntPipe) id: number): Promise<UserDto> {
    const user: User = await this.tryGetUserById(id);
    const dto: UserDto = this._mapper.users.mapDto(user);

    return dto;
  }

  @Post()
  @Roles(Role.Administrator, Role.OrganizationAdmin)
  public async postUser(@RequestUser() user: UserDto, @Body() request: UserDto): Promise<UserDto> {
    await this.validatePostModel(user, request);

    const entity: User = this._mapper.users.mapEntity(request);
    await this._usersService.add(entity);

    const dto: UserDto = this._mapper.users.mapDto(entity);
    return dto;
  }

  @Put(":id")
  public async putUser(@RequestUser() user: UserDto, @Param("id", ParseIntPipe) id: number, @Body() request: UserDtoPartial): Promise<UserDto> {
    const userEntity: User = await this.tryGetUserById(id);

    await this.validatePutModel(user, userEntity, request);

    this._mapper.users.mapEntity(request, userEntity);

    //Do not change user role unless an administrator is making the request.
    if(user.role !== Role.Administrator) {
      delete userEntity.role;
    }

    await this._usersService.update(userEntity);

    const dto: UserDto = this._mapper.users.mapDto(userEntity);
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

    await this._usersService.delete(id);
  }

  private async tryGetUserById(id: number): Promise<User> {
    const user: User = await this._usersService.getById(id);

    if(user == null) {
      throw new NotFoundException(`User ID does not exist: ${id}`);
    }

    return user;
  }

  private async validatePostModel(requestUser: UserDto, request: UserDto): Promise<void> {
    const errors: string[] = [];

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
    else if(request.organizationId != null && !await this._orgService.idExists(request.organizationId)) {
      errors.push(`organizationId does not exist: ${request.organizationId}`);
    }

    if(errors.length > 0) {
      throw new ConflictException(errors);
    }
  }

  private async validatePutModel(requestUser: UserDto, entity: User, request: UserDtoPartial): Promise<void> {
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
    else if(request.organizationId != null && !await this._orgService.idExists(request.organizationId)) {
      errors.push(`organizationId does not exist: ${request.organizationId}`);
    }

    if(requestUser.id !== entity.id && (requestUser.role !== Role.Administrator && requestUser.role !== Role.OrganizationAdmin)) {
      errors.push("You may not edit a different user's information");
    }

    if(errors.length > 0) {
      throw new ConflictException(errors);
    }
  }
}