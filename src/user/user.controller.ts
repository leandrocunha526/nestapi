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
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login-user.dto';
import { UserResponse } from './dto/user-response.dto';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiParam } from '@nestjs/swagger';

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

    @UseGuards(AuthGuard('jwt'))
    @ApiParam({
        name: 'id',
        required: true,
        description: 'an integer for the user id',
        schema: { oneOf: [{ type: 'integer' }] },
    })
    @Delete('/delete/:id')
    async remove(@Res() res, @Param('id') id: number) {
        try {
            const user = await this.userService.remove(id);
            return res.status(HttpStatus.OK).json({
                message: 'User deleted sucessfully',
                user,
            });
        } catch (error) {
            return res.status(HttpStatus.NOT_FOUND).json({
                error: error,
                message: 'User not exist',
            });
        }
    }
}
