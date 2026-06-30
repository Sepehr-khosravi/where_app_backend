import { Module } from '@nestjs/common';
//modules
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './presentation/auth/auth.module';
import { UserModule } from './presentation/users/users.module';
import { RelationModule } from './presentation/relations/relations.module';
import { SocketModule } from './presentation/websocket/socket.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    RelationModule,
    SocketModule,
    //rate limiting
    // ThrottlerModule.forRoot(
      // [
      // {
      //   name : "short",
      //   ttl : 1000,
      //   limit : 3,
      // },
      // {
      //   name : "medium",
      //   ttl : 10000,
      //   limit : 20
      // },
      // {
      //   name : "long",
      //   ttl : 60000,
      //   limit : 100
      // }
      // ]
    // )
    ThrottlerModule.forRoot([
      {
        name : 'default',
        ttl : 10000,
        limit : 20
      }
    ])
  ],
  providers : [
    {
      provide : APP_GUARD,
      useClass : ThrottlerGuard
    }
  ]
})
export class AppModule {}
