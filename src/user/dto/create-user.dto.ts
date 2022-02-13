import { IsString, Length } from 'class-validator';

export class CreateUserDto {
    @IsString()
    email: string;

    @IsString()
    name: string;

    @IsString()
    @Length(5, 20)
    username: string;

    @IsString()
    @Length(6, 20)
    password: string;
}
