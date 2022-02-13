import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { PrismaService } from './../prisma/prisma.service';
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async login(loginDto: LoginDto): Promise<UserResponse> {
        const { username, password } = loginDto;

        const user = await this.prismaService.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const validatePassword = await bcrypt.compare(password, user.password);

        if (!validatePassword) {
            throw new UnauthorizedException('invalid password');
        }

        return {
            token: this.jwtService.sign({
                username,
            }),
            user,
        };
    }

    async register(createUserDto: CreateUserDto): Promise<UserResponse> {
        const user = await this.usersService.createUser(createUserDto);
        return {
            token: this.jwtService.sign({ username: user.username }),
            user,
        };
    }
}
