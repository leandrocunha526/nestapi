import { UserRegister } from './dto/user-register.dto';
import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Delete,
    HttpStatus,
    Res,
    Param,
    Put,
} from '@nestjs/common';
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
    register(@Body() createUserDto: CreateUserDto): Promise<UserRegister> {
        return this.userService.register(createUserDto);
    }

    //Need authenticate with Auth Guard to access routes below and recommends use of Insomnia
    @UseGuards(AuthGuard('jwt'))
    @Get('/profile')
    getLoggedUser(@AuthUser() user: User): User {
        delete user.password;
        return user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete/:id')
    async remove(@Res() res, @Param('id') id: number) {
        try {
            await this.userService.remove(id);
            return res.status(HttpStatus.OK).json({
                message: 'User deleted successfully',
            });
        } catch (error) {
            return res.status(HttpStatus.NOT_FOUND).json({
                error: error,
            });
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/update/:id')
    async update(
        @Body() createUserDto: CreateUserDto,
        @Res() res,
        @Param('id') id: number,
    ) {
        try {
            await this.userService.update(createUserDto, id);
            return res.status(HttpStatus.OK).json({
                message: 'User updated successfully',
            });
        } catch (error) {
            return res.json({
                error: error,
            });
        }
    }
}
