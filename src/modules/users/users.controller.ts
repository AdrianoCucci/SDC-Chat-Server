import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
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
    const user: User = await this._usersService.tryGetById(id);
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
    const requestUser: UserResponse = this._authService.getRequestUser(req);
    await this.validatePutModel(requestUser, id, request);

    let user: User = this._mapper.users.toEntity(request);
    delete user.password;

    if(requestUser.role !== Role.Administrator) {
      delete user.role;
    }

    user = await this._usersService.update(id, user);

    const dto: UserResponse = this._mapper.users.toResponse(user);
    return dto;
  }

  @Delete(":id")
  @AuthorizeRoles(Role.Administrator)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this._usersService.delete(id);
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

  private async validatePutModel(requestUser: UserResponse, id: number, request: UserRequest): Promise<void> {
    const user: User = await this._usersService.tryGetById(id);
    const errors: string[] = [];

    if(request.username) {
      const userByUsername: User = await this._usersService.getByUsername(request.username);

      if(userByUsername != null && userByUsername.id !== id) {
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