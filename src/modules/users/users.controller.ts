import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { Role } from 'src/models/auth/role';
import { User } from 'src/models/users/user';
import { UserParams } from 'src/models/users/user-params';
import { UserRequest } from 'src/models/users/user-request';
import { UserResponse } from 'src/models/users/user-response';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthorizeGuard)
export class UsersController {
  constructor(private _usersService: UsersService, private _mapper: MapperService) { }

  @Get()
  public async getAllUsers(@Query() params: UserParams): Promise<UserResponse[]> {
    const users: User[] = await this._usersService.getAll(params);
    const dtos: UserResponse[] = this._mapper.users.mapResponses(users);

    return dtos;
  }

  @Get(":id")
  public async getUserById(@Param("id", ParseIntPipe) id: number): Promise<UserResponse> {
    const user: User = await this.tryGetUserById(id);
    const dto: UserResponse = this._mapper.users.mapResponse(user);

    return dto;
  }

  @Post()
  @Roles(Role.Administrator)
  public async postUser(@Body() request: UserRequest): Promise<UserResponse> {
    await this.validatePostModel(request);

    const user: User = this._mapper.users.mapEntity(request);
    await this._usersService.add(user);

    const dto: UserResponse = this._mapper.users.mapResponse(user);
    return dto;
  }

  @Put(":id")
  public async putUser(@RequestUser() user: UserResponse, @Param("id", ParseIntPipe) id: number, @Body() request: UserRequest): Promise<UserResponse> {
    const userEntity: User = await this.tryGetUserById(id);

    await this.validatePutModel(user, userEntity, request);

    this._mapper.users.mapEntity(request, userEntity);

    //Do not change user passwords from an update request - passwords should be changed from a password reset request.
    delete userEntity.password;

    //Do not change user role unless an administrator is making the request.
    if(user.role !== Role.Administrator) {
      delete userEntity.role;
    }

    await this._usersService.update(userEntity);

    const dto: UserResponse = this._mapper.users.mapResponse(userEntity);
    return dto;
  }

  @Delete(":id")
  @Roles(Role.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@RequestUser() user: UserResponse, @Param("id", ParseIntPipe) id: number): Promise<void> {
    if(user.id === id) {
      throw new ConflictException("You may not delete your own user account");
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

  private async validatePostModel(request: UserRequest): Promise<void> {
    const errors: string[] = [];

    if(!request.username) {
      errors.push("Username is required");
    }
    else if(await this._usersService.usernameExists(request.username)) {
      errors.push(`Username already exists: ${request.username}`);
    }

    if(!request.password) {
      errors.push("Password is required");
    }
    if(!request.role) {
      errors.push("Role is required");
    }

    if(errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }

  private async validatePutModel(requestUser: UserResponse, user: User, request: UserRequest): Promise<void> {
    const errors: string[] = [];

    if(request.username) {
      const userByUsername: User = await this._usersService.getByUsername(request.username);

      if(userByUsername != null && userByUsername.id !== user.id) {
        errors.push(`Username already exists: ${request.username}`);
      }
    }

    if(requestUser.id !== user.id && requestUser.role !== Role.Administrator) {
      errors.push("You may not edit a different user's information");
    }

    if(errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
}