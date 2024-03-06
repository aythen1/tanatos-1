import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { FuneralModule } from './funeral/funeral.module';
import { OrderModule } from './order/order.module';
import { UserTypeModule } from './users/users.module';
import { StoreFloristModule } from './store/store.module';
import { CatModule } from './cat/cat.module';
import { PayPalModule } from './pay-payl/pay-payl.module';
import { Order } from './order/entities/order.entity';
import { Funeral } from './funeral/entities/funeral.entity';
import { Cat } from './cat/entities/cat.entity';
import { StoreFlorist } from './store/entities/store.entity';
import { PayPayl } from './pay-payl/entities/pay-payl.entity';
import { Usuario } from './users/entities/user.entity';
import { FavoritosModule } from './favoritos/favoritos.module';
import { Favorito } from './favoritos/entities/favorito.entity';
import { StripeModule } from './stripe/stripe.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '51.159.26.23',
      port: 23187,
      username: 'tanatos',
      password: 'Tanatos1234.',
      database: 'rdb',
      entities: [Order, Funeral, Cat, StoreFlorist, Usuario, PayPayl, Favorito],
      synchronize: true,
    }),
    FuneralModule,
    OrderModule,
    UserTypeModule,
    StoreFloristModule,
    CatModule,
    PayPalModule,
    FavoritosModule,
    FavoritosModule,
    StripeModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '24h' }, // Cambia según tus necesidades
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
