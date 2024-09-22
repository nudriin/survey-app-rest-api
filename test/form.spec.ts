import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
describe('FormController', () => {
    let app: INestApplication;
    let testService: TestService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        testService = app.get(TestService);
    });

    describe('POST /api/v1/forms', () => {
        let token: string;
        beforeEach(async () => {
            await testService.deleteUser();
            await testService.createUser();
            await testService.deleteForm();
            const response = await request(app.getHttpServer())
                .post('/api/v1/users/login')
                .send({
                    email: 'test@superadmin.com',
                    password: 'test',
                });

            token = response.body.data.token;
        });
        it('should be rejected if user not login', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/forms')
                .send({
                    name: 'test',
                    description: 'test',
                });

            console.info(response.body);

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });

        it('should be success create form', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/forms')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'test',
                    description: 'test',
                });

            console.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('test');
            expect(response.body.data.description).toBe('test');
        });
    });
});
