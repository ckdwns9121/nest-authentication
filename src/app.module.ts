import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './modules/user/user.module';
import { RecommandModule } from './modules/recommand/recommand.module';
import { LicenseKeyModule } from './modules/license-key/license-key.module';
import { LicenseByRecommandModule } from './modules/license-by-recommand/license-by-recommand.module';
import { LicenseByOrder } from './modules/license-by-order/license-by-order.entity';
import { SmsModule } from './sms/sms.module';
import databaseConfig from './configs/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '../**/*.entity.{js,ts}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    LicenseKeyModule,
    RecommandModule,
    LicenseByRecommandModule,
    LicenseByOrder,
    SmsModule,
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
