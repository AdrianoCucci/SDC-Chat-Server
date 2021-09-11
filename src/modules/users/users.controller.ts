import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/models/auth/role';
import { User } from 'src/models/users/user';
import { UserRequest } from 'src/models/users/user-request';
import { UserResponse } from 'src/models/users/user-response';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private _usersService: UsersService, private _mapper: MapperService) { }

  @Get()
  @Roles(Role.User)
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
  public async postUser(@Body() request: UserRequest): Promise<UserResponse> {
    const user: User = this._mapper.users.toEntity(request);
    await this._usersService.add(user);

    const dto: UserResponse = this._mapper.users.toResponse(user);
    return dto;
  }

  @Put(":id")
  public async putUser(@Param("id", ParseIntPipe) id: number, @Body() request: UserRequest): Promise<UserResponse> {
    let user: User = this._mapper.users.toEntity(request);
    user = await this._usersService.update(id, user);

    const dto: UserResponse = this._mapper.users.toResponse(user);
    return dto;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this._usersService.delete(id);
  }
}