import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Role } from 'src/models/auth/role';
import { UserSecret } from 'src/modules/core/user-secrets/entities/user-secret.entity';
import { User } from 'src/modules/core/users/entities/user.entity';
import { UsersService } from 'src/modules/core/users/users.service';
import { generateUserSecret } from 'src/utils/hash-utils';

import appConfig from 'src/app.config';
import { UserSecretsService } from 'src/modules/core/user-secrets/user-secrets.service';

@Injectable()
export class StartupService implements OnApplicationBootstrap {
  private readonly _logger = new Logger(StartupService.name);

  constructor(private _usersService: UsersService, private _userSecretsService: UserSecretsService) { }

  public async onApplicationBootstrap(): Promise<void> {
    this._logger.log("Performing startup tasks");

    try {
      await this.createRootUser();
      await this.setAllUsersOffline();
    }
    catch(error) {
      this._logger.error(error.message || error);
      throw error;
    }
  }

  private async createRootUser(): Promise<void> {
    this._logger.log("Checking if root user should be created...");
    const adminExists: boolean = await this._usersService.hasAnyWithModel({ role: Role.Administrator });

    if(adminExists) {
      this._logger.log("One or more Administrator users exist - skipping root user creation.");
      return;
    }

    this._logger.log("Creating root user...");
    const rootUsername: string = appConfig.startup.rootUser.username;
    const rootPassword: string = appConfig.startup.rootUser.password;

    if(!rootUsername || !rootPassword) {
      throw new Error("Root user username and/or password has not been defined!");
    }

    let rootUser = new User({ role: Role.Administrator, username: rootUsername });
    rootUser = await this._usersService.add(rootUser);

    const secret: UserSecret = await generateUserSecret(rootUser.id, rootPassword);
    await this._userSecretsService.add(secret);

    this._logger.log("Root user created & inserted into database successfully.");
  }

  private async setAllUsersOffline(): Promise<void> {
    this._logger.log("Resetting all users to 'offline' status...");
    const users: User[] = await this._usersService.getAll();

    if(users) {
      for(let i = 0; i < users.length; i++) {
        users[i].isOnline = false;
      }
    }

    await this._usersService.updateMany(users);
    this._logger.log("All users set to 'offline' status successfully.");
  }
}