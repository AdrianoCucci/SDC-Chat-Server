import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizeGuard } from 'src/modules/shared/jwt-auth/authorize.guard';

const jwtRegisterModule: DynamicModule = JwtModule.register({});

@Module({
  imports: [jwtRegisterModule],
  exports: [
    jwtRegisterModule,
    AuthorizeGuard
  ],
  providers: [AuthorizeGuard]
})
export class JwtAuthModule { }