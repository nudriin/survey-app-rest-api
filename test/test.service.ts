import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { QuestionResponse } from '../src/model/question.model';
import { RespondenResponse } from '../src/model/responden.model';

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) {}

    async deleteUser() {
        const user = await this.prismaService.user.findFirst({
            where: {
                email: 'test@test.com',
            },
        });

        if (user) {
            const form = await this.prismaService.form.findFirst({
                where: {
                    userId: user.id,
                },
            });

            if (form) {
                await this.prismaService.formDetails.deleteMany({
                    where: {
                        formId: form.id,
                    },
                });

                await this.prismaService.form.deleteMany({
                    where: {
                        id: form.id,
                    },
                });
            }
        }

        await this.prismaService.user.deleteMany({
            where: {
                email: 'test@test.com',
            },
        });
    }

    async deleteSuperAdmin() {
        const user = await this.prismaService.user.findFirst({
            where: {
                email: 'test@superadmin.com',
            },
        });

        if (user) {
            const form = await this.prismaService.form.findFirst({
                where: {
                    userId: user.id,
                },
            });

            if (form) {
                await this.prismaService.formDetails.deleteMany({
                    where: {
                        formId: form.id,
                    },
                });

                await this.prismaService.form.deleteMany({
                    where: {
                        id: form.id,
                    },
                });
            }
            await this.prismaService.user.deleteMany({
                where: {
                    email: 'test@superadmin.com',
                },
            });
        }
    }

    async createUser(): Promise<User> {
        const user = await this.prismaService.user.create({
            data: {
                email: 'test@test.com',
                password: await bcrypt.hash('test', 10),
                name: 'test',
            },
        });

        return user;
    }

    async createSuperAdmin(): Promise<User> {
        const user = await this.prismaService.user.create({
            data: {
                email: 'test@superadmin.com',
                password: await bcrypt.hash('test', 10),
                name: 'test',
                role: 'SUPER_ADMIN',
            },
        });

        return user;
    }

    async deleteForm() {
        const form = await this.prismaService.form.findFirst({
            where: {
                name: 'test',
            },
        });

        if (form) {
            await this.prismaService.formDetails.deleteMany({
                where: {
                    formId: form.id,
                },
            });

            await this.prismaService.form.deleteMany({
                where: {
                    name: 'test',
                },
            });
        }
    }

    async deleteQuestion() {
        const question = await this.prismaService.question.findFirst({
            where: {
                question: 'test',
            },
        });

        if (question) {
            await this.prismaService.response.deleteMany({
                where: {
                    question_id: question.id,
                },
            });

            await this.prismaService.question.deleteMany({
                where: {
                    question: 'test',
                },
            });
        }
    }

    async createQuestion(): Promise<QuestionResponse> {
        const question = await this.prismaService.question.create({
            data: {
                question: 'test',
                acronim: 'test',
                option_1: 'test_option_1',
                option_2: 'test_option_2',
                option_3: 'test_option_3',
                option_4: 'test_option_4',
            },
        });

        return question;
    }

    async deleteResponden() {
        const responden = await this.prismaService.responden.findFirst({
            where: {
                name: 'test',
            },
        });

        if (responden) {
            await this.prismaService.response.deleteMany({
                where: {
                    responden_id: responden.id,
                },
            });

            await this.prismaService.responden.deleteMany({
                where: {
                    name: 'test',
                },
            });
        }
    }

    async createResponden(): Promise<RespondenResponse> {
        const responden = await this.prismaService.responden.create({
            data: {
                name: 'test',
                email: 'test@test.com',
                address: 'test',
                phone: 'test',
                age: 1,
                education: 'test',
                profession: 'test',
                service_type: 'test',
                gender: 'MALE',
            },
        });

        return responden;
    }
}
