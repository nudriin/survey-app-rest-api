import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { QuestionModule } from './question/question.module';

@Module({
    imports: [CommonModule, UserModule, FormModule, QuestionModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
