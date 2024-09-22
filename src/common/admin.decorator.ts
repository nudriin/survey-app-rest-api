import {
    createParamDecorator,
    ExecutionContext,
    HttpException,
} from '@nestjs/common';

export const Admin = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new HttpException('Unauthorized', 401);
        }

        if (user.role == 'ADMIN' || user.role == 'SUPER_ADMIN') {
            return user;
        } else {
            throw new HttpException('Forbidden', 403);
        }
    },
);
