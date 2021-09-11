import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGuard } from './guards/authorize.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthorizeGuard }
  ]
})
export class AppModule { }