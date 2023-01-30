import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './modules/user/user.module';
import { RecommandModule } from './modules/recommand/recommand.module';
import { LicenseKeyModule } from './modules/license-key/license-key.module';
import { LicenseByRecommandModule } from './modules/license-by-recommand/license-by-recommand.module';
import { LicenseByOrder } from './modules/license-by-order/license-by-order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule,
    UserModule,
    LicenseKeyModule,
    RecommandModule,
    LicenseByRecommandModule,
    LicenseByOrder,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
