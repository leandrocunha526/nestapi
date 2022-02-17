import { UserRegister } from './dto/user-register.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { PrismaService } from './../prisma/prisma.service';
import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';

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

    async register(createUserDto: CreateUserDto): Promise<UserRegister> {
        const user = await this.usersService.createUser(createUserDto);
        return {
            user,
        };
    }

    async remove(id: number): Promise<any> {
        await this.prismaService.user.delete({
            where: { id: Number(id) },
        });
    }

    async update(data: CreateUserDto, id: number): Promise<User> {
        const exist = await this.prismaService.user.findUnique({
            where: {
                username: data.username,
            },
        });
        if (exist) {
            throw new ConflictException('Username already exists');
        }
        const hanshedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prismaService.user.update({
            where: {
                id: Number(id),
            },
            data: {
                ...data,
                password: hanshedPassword,
            },
        });
        delete user.password;
        return user;
    }
}
