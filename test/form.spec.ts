import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { FormResponse } from '../src/model/form.model';
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

    describe('GET /api/v1/forms', () => {
        let token: string;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let tokenUser: string;
        beforeEach(async () => {
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
        it('should be success create form', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/forms')
                .set('Authorization', `Bearer ${token}`);

            console.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
        });
    });

    describe('GET /api/v1/forms/:formId', () => {
        let token: string;
        let form: FormResponse;
        beforeEach(async () => {
            await testService.deleteSuperAdmin();
            await testService.createSuperAdmin();
            let response = await request(app.getHttpServer())
                .post('/api/v1/users/login')
                .send({
                    email: 'test@superadmin.com',
                    password: 'test',
                });
            token = response.body.data.token;

            response = await request(app.getHttpServer())
                .post('/api/v1/forms')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'test',
                    description: 'test',
                });

            form = response.body.data;
        });

        it('should be fail get form by id if form id is not found', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/v1/forms/${form.id + 1}`,
            );
            console.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBe('form not found');
        });

        it('should be success get form by id', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/v1/forms/${form.id}`,
            );
            console.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe(form.name);
            expect(response.body.data.description).toBe(form.description);
            expect(response.body.data.id).toBe(form.id);
            expect(response.body.data.userId).toBe(form.userId);
        });

        afterEach(async () => {
            await testService.deleteForm();
        });
    });

    describe('PATCH /api/v1/forms', () => {
        let token: string;
        let form: FormResponse;
        beforeEach(async () => {
            await testService.deleteSuperAdmin();
            await testService.createSuperAdmin();
            let response = await request(app.getHttpServer())
                .post('/api/v1/users/login')
                .send({
                    email: 'test@superadmin.com',
                    password: 'test',
                });
            token = response.body.data.token;

            response = await request(app.getHttpServer())
                .post('/api/v1/forms')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'test',
                    description: 'test',
                });

            form = response.body.data;
        });

        it('should be failed update form if user id is wrong', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/api/v1/forms`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: form.id + 1,
                    content: JSON.stringify([
                        {
                            extraAttr: {
                                helperText:
                                    'Deskripsi, ringkasan, dan lain-lain',
                                label: 'Name',
                                placeholder: 'Masukan data...',
                                required: false,
                            },
                            id: '5957',
                            type: 'TextField',
                        },
                    ]),
                });
            console.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be success update form', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/api/v1/forms`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: form.id,
                    content: JSON.stringify([
                        {
                            extraAttr: {
                                helperText:
                                    'Deskripsi, ringkasan, dan lain-lain',
                                label: 'Name',
                                placeholder: 'Masukan data...',
                                required: false,
                            },
                            id: '5957',
                            type: 'TextField',
                        },
                    ]),
                    published: true,
                });
            console.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe(form.name);
            expect(response.body.data.description).toBe(form.description);
            expect(response.body.data.id).toBe(form.id);
            expect(response.body.data.userId).toBe(form.userId);
        });

        afterEach(async () => {
            await testService.deleteForm();
        });
    });

    describe('GET /api/v1/forms/url/:shareURL', () => {
        let token: string;
        let form: FormResponse;
        beforeEach(async () => {
            await testService.deleteSuperAdmin();
            await testService.createSuperAdmin();
            let response = await request(app.getHttpServer())
                .post('/api/v1/users/login')
                .send({
                    email: 'test@superadmin.com',
                    password: 'test',
                });
            token = response.body.data.token;

            response = await request(app.getHttpServer())
                .post('/api/v1/forms')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'test',
                    description: 'test',
                });

            form = response.body.data;
        });

        it('should be failed get form by shareURL if form shareURL is not found', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/v1/forms/url/${form.shareURL + 1}`,
            );
            console.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBe('form not found');
        });

        it('should be success get form by shareURL', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/v1/forms/url/${form.shareURL}`,
            );
            console.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe(form.name);
            expect(response.body.data.description).toBe(form.description);
            expect(response.body.data.id).toBe(form.id);
            expect(response.body.data.userId).toBe(form.userId);
            expect(response.body.data.shareURL).toBe(form.shareURL);
            expect(response.body.data.visit).toBe(form.visit + 1);
        });

        afterEach(async () => {
            await testService.deleteForm();
        });
    });

    describe('PATCH /api/v1/forms/url', () => {
        let token: string;
        let form: FormResponse;
        beforeEach(async () => {
            await testService.deleteSuperAdmin();
            await testService.createSuperAdmin();
            let response = await request(app.getHttpServer())
                .post('/api/v1/users/login')
                .send({
                    email: 'test@superadmin.com',
                    password: 'test',
                });
            token = response.body.data.token;

            response = await request(app.getHttpServer())
                .post('/api/v1/forms')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'test',
                    description: 'test',
                });

            form = response.body.data;
        });

        it('should be failed update form if user id is wrong', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/api/v1/forms/url`)
                .send({
                    shareURL: form.shareURL + 1,
                    content: JSON.stringify([
                        {
                            extraAttr: {
                                helperText:
                                    'Deskripsi, ringkasan, dan lain-lain',
                                label: 'Name',
                                placeholder: 'Masukan data...',
                                required: false,
                            },
                            id: '5957',
                            type: 'TextField',
                        },
                    ]),
                });
            console.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be success update form', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/api/v1/forms/url`)
                .send({
                    shareURL: form.shareURL,
                    content: JSON.stringify([
                        { 2566: 'Nurdin', 3669: '20', 9957: 'Test' },
                    ]),
                    published: true,
                });
            console.info(response.body);
            console.info(response.body.data.formDetails);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe(form.name);
            expect(response.body.data.description).toBe(form.description);
            expect(response.body.data.id).toBe(form.id);
            expect(response.body.data.userId).toBe(form.userId);
        });

        afterEach(async () => {
            await testService.deleteForm();
        });
    });

    describe('GET /api/v1/forms/all/statistics', () => {
        let token: string;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let tokenUser: string;
        beforeEach(async () => {
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
        it('should be success get forms statistics', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/forms/all/statistics')
                .set('Authorization', `Bearer ${token}`);

            console.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.totalVisit).toBeDefined();
            expect(response.body.data.totalSubmission).toBeDefined();
            expect(response.body.data.totalSubmissionThisMonth).toBeDefined();
        });

        it('should be reject if not admin get forms statistics', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/forms/all/statistics')
                .set('Authorization', `Bearer ${token + 1}`);

            console.info(response.body);

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('GET /api/v1/forms/all/submission-distribution-form', () => {
        let token: string;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let tokenUser: string;
        beforeEach(async () => {
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
        it('should be success get forms distribustion', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/forms/all/submission-distribution-form')
                .set('Authorization', `Bearer ${token}`);

            console.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
        });

        it('should be reject if not admin get forms distribustion', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/forms/all/submission-distribution-form')
                .set('Authorization', `Bearer ${token + 1}`);

            console.info(response.body);

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('GET /api/v1/forms/all/monthly-submission-count', () => {
        let token: string;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let tokenUser: string;
        beforeEach(async () => {
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
        it('should be success get forms distribustion', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/forms/all/monthly-submission-count')
                .set('Authorization', `Bearer ${token}`);

            console.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
        });

        it('should be reject if not admin get forms distribustion', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/forms/all/monthly-submission-count')
                .set('Authorization', `Bearer ${token + 1}`);

            console.info(response.body);

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });
    });
});

// {
//     extraAttr :{
// helperText: "Deskripsi, ringkasan, dan lain-lain",
// label: "Name",
// placeholder: "Masukan data...",
// required: false,
// },
// id: "5957",
// type: "TextField"
// }
