import { Module } from '@nestjs/common';
//modules
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './presentation/auth/auth.module';
import { UserModule } from './presentation/users/users.module';
import { RelationModule } from './presentation/relations/relations.module';
import { SocketModule } from './presentation/websocket/socket.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    RelationModule,
    SocketModule
  ],
})
export class AppModule {}
