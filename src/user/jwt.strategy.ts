import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.secret,
            ignoreExpiration: false,
        });
    }
    async validate(payload: { username: string }) {
        const user = await this.prismaService.user.findUnique({
            where: {
                username: payload.username,
            },
        });
        return user;
    }
}
