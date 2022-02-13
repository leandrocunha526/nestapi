import { Module } from '@nestjs/common';
import { UsersModule } from './../users/users.module';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [UserService, PrismaService, JwtStrategy],
    controllers: [UserController],
})
export class UserModule {}
