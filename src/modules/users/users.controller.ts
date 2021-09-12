import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthorizeRoles } from 'src/decorators/authorize-roles.decorator';
import { Role } from 'src/models/auth/role';
import { User } from 'src/models/users/user';
import { UserRequest } from 'src/models/users/user-request';
import { UserResponse } from 'src/models/users/user-response';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private _authService: AuthService, private _usersService: UsersService, private _mapper: MapperService) { }

  @Get()
  public async getAllUsers(): Promise<UserResponse[]> {
    const users: User[] = await this._usersService.getAll();
    const dtos: UserResponse[] = this._mapper.users.toResponses(users);

    return dtos;
  }

  @Get(":id")
  public async getUserById(@Param("id", ParseIntPipe) id: number): Promise<UserResponse> {
    const user: User = await this.tryGetUserById(id);
    const dto: UserResponse = this._mapper.users.toResponse(user);

    return dto;
  }

  @Post()
  @AuthorizeRoles(Role.Administrator)
  public async postUser(@Body() request: UserRequest): Promise<UserResponse> {
    await this.validatePostModel(request);

    const user: User = this._mapper.users.toEntity(request);
    await this._usersService.add(user);

    const dto: UserResponse = this._mapper.users.toResponse(user);
    return dto;
  }

  @Put(":id")
  public async putUser(@Req() req: Request, @Param("id", ParseIntPipe) id: number, @Body() request: UserRequest): Promise<UserResponse> {
    const user: User = await this.tryGetUserById(id);
    const requestUser: UserResponse = this._authService.getRequestUser(req);

    await this.validatePutModel(requestUser, user, request);

    this._mapper.users.toEntity(request, user);

    delete user.password;
    if(requestUser.role !== Role.Administrator) {
      delete user.role;
    }

    await this._usersService.update(user);

    const dto: UserResponse = this._mapper.users.toResponse(user);
    return dto;
  }

  @Delete(":id")
  @AuthorizeRoles(Role.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@Req() req: Request, @Param("id", ParseIntPipe) id: number): Promise<void> {
    const requestUser: UserResponse = this._authService.getRequestUser(req);

    if(requestUser.id === id) {
      throw new ConflictException(["You may not delete your own user account"]);
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