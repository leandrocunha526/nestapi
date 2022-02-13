import { User } from '.prisma/client';

export class UserResponse {
    token: string;
    user: User;
}
