import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { SkmModule } from './skm/skm.module';

@Module({
    imports: [CommonModule, UserModule, FormModule, SkmModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
