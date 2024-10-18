import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { QuestionModule } from './question/question.module';
import { RespondenModule } from './responden/responden.module';
import { ResponsesModule } from './responses/responses.module';

@Module({
    imports: [CommonModule, UserModule, FormModule, QuestionModule, RespondenModule, ResponsesModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
