import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule, UsersModule, PrismaModule, UserModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
