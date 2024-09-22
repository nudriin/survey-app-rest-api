import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';

@Module({
    imports: [CommonModule, UserModule, FormModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
