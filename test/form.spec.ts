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
        let tokenUser: string;
        beforeEach(async () => {
            await testService.deleteSuperAdmin();
            await testService.createSuperAdmin();
            await testService.deleteUser();
            await testService.createUser();
            await testService.deleteForm();
            let response = await request(app.getHttpServer())
                .post('/api/v1/users/login')
                .send({
                    email: 'test@superadmin.com',
                    password: 'test',
                });
            token = response.body.data.token;

            response = await request(app.getHttpServer())
                .post('/api/v1/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'test',
                });
            tokenUser = response.body.data.token;
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

        it('should be rejected if user not admin', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/forms')
                .set('Authorization', `Bearer ${tokenUser}`)
                .send({
                    name: 'test',
                    description: 'test',
                });

            console.info(response.body);

            expect(response.status).toBe(403);
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
