import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login-user.dto';
import { UserResponse } from './dto/user-response.dto';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<UserResponse> {
        return this.userService.login(loginDto);
    }

    @Post('/register')
    register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        return this.userService.register(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/profile')
    getLoggedUser(@AuthUser() user: User): User {
        return user;
    }
}
