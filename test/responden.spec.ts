import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
describe('RespondenController', () => {
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

    beforeAll((done) => {
        done();
    });

    afterAll((done) => {
        done();
    });

    describe('POST /api/v1/skm/responden', () => {
        let token: string;
        beforeEach(async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/users/login')
                .send({
                    email: 'test@superadmin.com',
                    password: 'test',
                });
            token = response.body.data.token;
            await testService.deleteResponden();
        });
        it('should be rejected if user not login', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm/responden')
                .set({
                    authorization: `Bearer ${token + 1}`,
                })
                .send({
                    name: 'test',
                    email: 'test',
                    address: 'test',
                    phone: 'test',
                    age: 1,
                    education: 'test',
                    profession: 'test',
                    service_type: 'test',
                    gender: 'MALE',
                });

            console.log(response.body);
            expect(response.status).toBe(401);
            expect(response.body.errors).toBe('Unauthorized');
        });

        it('should be rejected if request invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm/responden')
                .set({
                    authorization: `Bearer ${token}`,
                })
                .send({
                    name: '',
                    email: '',
                    address: '',
                    phone: '',
                    age: 0,
                    education: '',
                    profession: '',
                    service_type: '',
                    gender: '',
                });

            console.log(response.body);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be rejected if gender not match', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm/responden')
                .set({
                    authorization: `Bearer ${token}`,
                })
                .send({
                    name: 'test',
                    email: 'test@test.com',
                    address: 'test',
                    phone: 'test',
                    age: 1,
                    education: 'test',
                    profession: 'test',
                    service_type: 'test',
                    gender: 'WRONG',
                });

            console.log(response.body);
            expect(response.status).toBe(500);
            expect(response.body.errors);
        });

        it('should success create responden', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm/responden')
                .set({
                    authorization: `Bearer ${token}`,
                })
                .send({
                    name: 'test',
                    email: 'test@test.com',
                    address: 'test',
                    phone: 'test',
                    age: 1,
                    education: 'test',
                    profession: 'test',
                    service_type: 'test',
                    gender: 'MALE',
                });

            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.name).toBe('test');
            expect(response.body.data.email).toBe('test@test.com');
            expect(response.body.data.address).toBe('test');
            expect(response.body.data.phone).toBe('test');
            expect(response.body.data.age).toBe(1);
            expect(response.body.data.education).toBe('test');
            expect(response.body.data.profession).toBe('test');
            expect(response.body.data.service_type).toBe('test');
            expect(response.body.data.gender).toBe('MALE');
        });
    });
});
