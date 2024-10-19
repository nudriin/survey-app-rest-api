import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { RespondenResponse } from '../src/model/responden.model';
import { QuestionResponse } from '../src/model/question.model';
import { ResponsesResponse } from '../src/model/responses.model';
describe('ResponsesController', () => {
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

    describe('POST /api/v1/skm/responses', () => {
        let question: QuestionResponse;
        let responden: RespondenResponse;
        beforeEach(async () => {
            await testService.deleteQuestion();
            await testService.deleteResponden();
            question = await testService.createQuestion();
            responden = await testService.createResponden();
        });

        it('should be rejected if question not found', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm/responses')
                .send({
                    question_id: question.id + 10,
                    responden_id: responden.id,
                    select_option: 1,
                });

            console.log(response.body);
            expect(response.status).toBe(404);
            expect(response.body.errors).toBe('question not found');
        });

        it('should be rejected if responden not found', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm/responses')
                .send({
                    question_id: question.id,
                    responden_id: responden.id + 10,
                    select_option: 1,
                });

            console.log(response.body);
            expect(response.status).toBe(404);
            expect(response.body.errors).toBe('responden not found');
        });

        it('should success create responses', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/skm/responses')
                .send({
                    question_id: question.id,
                    responden_id: responden.id,
                    select_option: 1,
                });

            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.question_id).toBe(question.id);
            expect(response.body.data.responden_id).toBe(responden.id);
            expect(response.body.data.select_option).toBe(1);
        });
    });

    describe('GET /api/v1/skm/responses/:responsesId/response', () => {
        let responses: ResponsesResponse;
        beforeEach(async () => {
            await testService.deleteQuestion();
            await testService.deleteResponden();
            responses = await testService.createResponses();
        });

        it('should be rejected if responses id not found', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/v1/skm/responses/${responses.id + 10}/response`,
            );

            console.log(response.body);
            expect(response.status).toBe(404);
            expect(response.body.errors).toBe('responses not found');
        });

        it('should success get responses by id', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/v1/skm/responses/${responses.id}/response`,
            );

            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.question_id).toBe(responses.question_id);
            expect(response.body.data.responden_id).toBe(
                responses.responden_id,
            );
            expect(response.body.data.select_option).toBe(1);
        });
    });
});
