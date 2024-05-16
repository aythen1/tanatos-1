import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as dotenv from 'dotenv';
dotenv.config();

ConfigModule.forRoot({
  envFilePath: '.env',
});
const configService = new ConfigService();
console.log(dotenv.config());
// Accede a las variables de entorno utilizando el método get del ConfigService
export const PAYPAL_API_SECRET = configService.get('PAYPAL_API_SECRET');
export const PAYPAL_API_CLIENT = configService.get('PAYPAL_API_CLIENT');
export const PAYPAL_API = configService.get('PAYPAL_API');
export const appTanatosEmail = configService.get('appTanatosEmail');
export const SECRET_KEY_STRIPE = configService.get('SECRET_KEY_STRIPE');

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('HOST'),
  port: +configService.get('PORT'),
  username: configService.get('USER'),
  password: configService.get('PASSWORD'),
  database: configService.get('DATABASE'),
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true,
  migrationsRun: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};

export const AppDataSource = new DataSource(DataSourceConfig);
