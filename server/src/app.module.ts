import { AuthModule } from '@_modules/auth/auth.module';
import { FileUploadModule } from '@_modules/file-upload/file-upload.module';
import { LifeGraphModule } from '@_modules/life-graph/life-graph.module';
import { ProfileModule } from '@_modules/profile/profile.module';
import { UserModule } from '@_modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        keepConnectionAlive: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    FileUploadModule,
    ProfileModule,
    LifeGraphModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
