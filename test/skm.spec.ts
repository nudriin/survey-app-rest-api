import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { QuestionResponse } from '../src/model/skm.model';
describe('SkmController', () => {
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

    describe('POST /api/v1/skm', () => {
        let token: string;
        beforeEach(async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/users/login')
                .send({
                    email: 'test@superadmin.com',
                    password: 'test',
                });
            token = response.body.data.token;
            await testService.deleteQuestion();
        });
        it('should be rejected if user not login', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm')
                .set({
                    authorization: `Bearer ${token + 1}`,
                })
                .send({
                    question: 'test',
                    acronim: 'test',
                    option_1: 'test',
                    option_2: 'test',
                    option_3: 'test',
                    option_4: 'test',
                });

            console.log(response.body);
            expect(response.status).toBe(401);
            expect(response.body.errors).toBe('Unauthorized');
        });

        it('should be rejected if request invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm')
                .set({
                    authorization: `Bearer ${token}`,
                })
                .send({
                    question: '',
                    acronim: '',
                    option_1: '',
                    option_2: '',
                    option_3: '',
                    option_4: '',
                });

            console.log(response.body);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should success create question', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm')
                .set({
                    authorization: `Bearer ${token}`,
                })
                .send({
                    question: 'test',
                    acronim: 'test',
                    option_1: 'test',
                    option_2: 'test',
                    option_3: 'test',
                    option_4: 'test',
                });

            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.question).toBe('test');
            expect(response.body.data.acronim).toBe('test');
            expect(response.body.data.option_1).toBe('test');
            expect(response.body.data.option_2).toBe('test');
            expect(response.body.data.option_3).toBe('test');
            expect(response.body.data.option_4).toBe('test');
            expect(response.body.data.status).toBe(false);
        });
    });

    describe('GET /api/v1/skm/question/:id', () => {
        let question: QuestionResponse;
        beforeEach(async () => {
            await testService.deleteQuestion();
            question = await testService.createQuestion();
        });
        it('should be rejected if question id not found', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/v1/skm/question/${question.id + 1}`,
            );

            console.log(response.body);
            expect(response.status).toBe(404);
            expect(response.body.errors).toBe('question not found');
        });

        it('should success create question', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/v1/skm/question/${question.id}`,
            );

            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.id).toBe(question.id);
            expect(response.body.data.question).toBe(question.question);
            expect(response.body.data.acronim).toBe(question.acronim);
            expect(response.body.data.option_1).toBe(question.option_1);
            expect(response.body.data.option_2).toBe(question.option_2);
            expect(response.body.data.option_3).toBe(question.option_3);
            expect(response.body.data.option_4).toBe(question.option_4);
            expect(response.body.data.status).toBe(false);
        });
    });
});
