import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
    ResponsesByUserResponse,
    ResponsesResponse,
    ResponsesSaveRequest,
    ResponsesUpdateRequest,
    ResponsesWithQuestionResponse,
} from '../model/responses.model';
import { ResponsesValidation } from './responses.validation';
import { User } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { EmailService } from '../common/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ResponsesService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
        private emailService: EmailService,
    ) {}

    async saveResponses(
        request: ResponsesSaveRequest,
    ): Promise<ResponsesResponse> {
        const validRequest: ResponsesSaveRequest =
            this.validationService.validate(
                ResponsesValidation.SAVE,
                request,
            ) as ResponsesSaveRequest;

        const question = await this.prismaService.question.findUnique({
            where: {
                id: validRequest.question_id,
            },
        });

        if (!question) throw new HttpException('question not found', 404);

        const countResponden = await this.prismaService.responden.count({
            where: {
                id: validRequest.responden_id,
            },
        });

        if (countResponden == 0)
            throw new HttpException('responden not found', 404);

        const selectedOptionKey = `option_${validRequest.select_option}`;
        const selectedOptionText = question[selectedOptionKey];

        const responses = await this.prismaService.response.create({
            data: {
                question_id: validRequest.question_id,
                responden_id: validRequest.responden_id,
                select_option: validRequest.select_option,
                select_option_text: selectedOptionText,
            },
        });

        return responses;
    }

    async findResponsesById(responsesId: number): Promise<ResponsesResponse> {
        const validId = this.validationService.validate(
            ResponsesValidation.FIND_ID,
            responsesId,
        );

        const response = await this.prismaService.response.findUnique({
            where: { id: validId },
            include: {
                question: true,
                responden: true,
            },
        });

        if (!response) throw new HttpException('responses not found', 404);

        return response;
    }

    async findAllResponsesByQuestionId(
        questionId: number,
    ): Promise<ResponsesResponse[]> {
        const validId = this.validationService.validate(
            ResponsesValidation.FIND_ID,
            questionId,
        );

        const findQuestion = await this.prismaService.question.findUnique({
            where: {
                id: validId,
            },
        });

        if (!findQuestion) throw new HttpException('question not found', 404);

        const allResponses = await this.prismaService.response.findMany({
            where: {
                question_id: validId,
            },
            include: {
                question: true,
                responden: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        if (!allResponses) throw new HttpException('responses not found', 404);

        return allResponses;
    }

    async findResponsesByUserId(
        userId: number,
    ): Promise<ResponsesByUserResponse[]> {
        const validId = this.validationService.validate(
            ResponsesValidation.FIND_ID,
            userId,
        );

        const findResponden = await this.prismaService.responden.findUnique({
            where: {
                id: validId,
            },
        });

        if (!findResponden) throw new HttpException('responden not found', 404);

        const userResponses = await this.prismaService.response.findMany({
            where: {
                responden_id: validId,
            },
            include: {
                question: true,
            },
        });

        if (!userResponses) throw new HttpException('responses not found', 404);

        return userResponses;
    }

    async updateUserResponse(
        request: ResponsesUpdateRequest,
        user: User,
    ): Promise<ResponsesResponse> {
        const validRequest: ResponsesUpdateRequest =
            this.validationService.validate(
                ResponsesValidation.UPDATE,
                request,
            ) as ResponsesUpdateRequest;

        const userCount = await this.prismaService.user.count({
            where: {
                id: user.id,
            },
        });

        if (userCount == 0) throw new HttpException('Unauthorized', 401);

        const foundResponse = await this.prismaService.response.findUnique({
            where: {
                id: validRequest.id,
            },
        });

        if (!foundResponse) throw new HttpException('responses not found', 404);

        foundResponse.select_option = validRequest.select_option;

        const responses = await this.prismaService.response.update({
            where: {
                id: foundResponse.id,
            },
            data: foundResponse,
        });

        return responses;
    }

    async findAllResponsesAndQuestion(): Promise<
        ResponsesWithQuestionResponse[]
    > {
        const data = await this.prismaService.question.findMany({
            include: {
                responses: true,
            },
        });

        if (!data) throw new HttpException('responses not found', 404);

        return data;
    }

    // @Cron('*/1 * * * *') // every 1 minutes
    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async autoExportReport() {
        const responsesQuestion = await this.findAllResponsesAndQuestion();

        try {
            // Responses Sheet
            const responsesSheet = XLSX.utils.json_to_sheet(
                responsesQuestion.map(
                    (
                        question: { responses: any[]; acronim: any },
                        index: number,
                    ) => {
                        // Calculate NRR
                        const nrr = (
                            question.responses.reduce(
                                (total: any, opt: { select_option: any }) =>
                                    total + opt.select_option,
                                0,
                            ) / question.responses.length
                        ).toFixed(3);

                        // Determine the "Keterangan" based on NRR value
                        let keterangan: string;
                        const floatNRR = parseFloat(nrr);
                        if (floatNRR >= 1.0 && floatNRR <= 2.5996) {
                            keterangan = 'Tidak Baik';
                        } else if (floatNRR >= 2.6 && floatNRR <= 3.064) {
                            keterangan = 'Kurang Baik';
                        } else if (floatNRR >= 3.0644 && floatNRR <= 3.532) {
                            keterangan = 'Baik';
                        } else {
                            keterangan = 'Sangat Baik';
                        }

                        // Return data for each row in the sheet
                        return {
                            No: index + 1,
                            'Unsur Pelayanan': question.acronim,
                            NRR: nrr,
                            Keterangan: keterangan,
                        };
                    },
                ),
            );

            const resultTableData = [];

            const headerRow = ['No'];
            responsesQuestion.forEach((value: { acronim: string }) => {
                headerRow.push(value.acronim);
            });
            resultTableData.push(headerRow);

            // Populate each row of `select_option` values
            responsesQuestion[0]?.responses.forEach((_, index) => {
                const row = [index + 1];
                responsesQuestion.forEach((question) => {
                    row.push(question.responses[index].select_option);
                });
                resultTableData.push(row);
            });

            // Total row
            const totalRow = ['Total'];
            responsesQuestion.forEach((value) => {
                const total = value.responses.reduce(
                    (sum, opt) => sum + opt.select_option,
                    0,
                );
                totalRow.push(total.toString());
            });
            resultTableData.push(totalRow);

            // NRR/Unsur row
            const nrrUnsurRow = ['NRR/Unsur'];
            responsesQuestion.forEach((value) => {
                const nrr = (
                    value.responses.reduce(
                        (sum, opt) => sum + opt.select_option,
                        0,
                    ) / value.responses.length
                ).toFixed(3);
                nrrUnsurRow.push(nrr);
            });
            resultTableData.push(nrrUnsurRow);

            // NRR Tertimbang row
            const nrrTertimbangRow = ['NRR Tertimbang'];
            responsesQuestion.forEach((value) => {
                const nrrTertimbang = (
                    (value.responses.reduce(
                        (sum, opt) => sum + opt.select_option,
                        0,
                    ) /
                        value.responses.length) *
                    0.111
                ).toFixed(3);
                nrrTertimbangRow.push(nrrTertimbang);
            });
            resultTableData.push(nrrTertimbangRow);

            // IKM Unit Pelayanan row
            const ikmUnitRow = ['IKM Unit Pelayanan'];
            const ikmUnitValue = (
                responsesQuestion.reduce((grandTotal, value) => {
                    const nrrTertimbang =
                        (value.responses.reduce(
                            (sum, opt) => sum + opt.select_option,
                            0,
                        ) /
                            value.responses.length) *
                        0.111;
                    return grandTotal + nrrTertimbang;
                }, 0) * 25
            ).toFixed(3);
            ikmUnitRow.push(ikmUnitValue);
            for (let i = 1; i < responsesQuestion.length; i++) {
                ikmUnitRow.push('');
            }
            resultTableData.push(ikmUnitRow);

            const resultTableSheet = XLSX.utils.aoa_to_sheet(resultTableData);
            // NrrBarChart Sheet
            const chartData = responsesQuestion.map((item, index) => {
                const averageValue = (
                    item.responses.reduce(
                        (total, opt) => total + opt.select_option,
                        0,
                    ) / item.responses.length
                ).toFixed(3);

                return [`U${index + 1}`, averageValue];
            });

            const barChartSheetData = [
                ['Label', 'Rata-rata Penilaian'],
                ...chartData,
            ];
            const nrrBarChartSheet = XLSX.utils.aoa_to_sheet(barChartSheetData);
            // Create workbook and append all sheets
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, responsesSheet, 'Responses');
            XLSX.utils.book_append_sheet(
                workbook,
                resultTableSheet,
                'ResultTable',
            );
            XLSX.utils.book_append_sheet(
                workbook,
                nrrBarChartSheet,
                'NrrBarChart',
            );

            const tempDir = path.join(process.cwd(), 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }

            const fileName = `survei-report-${new Date().toISOString().split('T')[0]}.xlsx`;
            const filePath = path.join(tempDir, fileName);

            // Export the workbook to an .xlsx file
            XLSX.writeFile(workbook, filePath);

            const admins = await this.prismaService.user.findMany({
                where: {
                    role: 'SUPER_ADMIN',
                },
                select: {
                    email: true,
                },
            });

            if (admins.length !== 0) {
                // throw new Error('No super admin found in the system');
                const adminEmails = admins.map((admin) => admin.email);

                // Send the email
                //!  Send email
                await this.emailService.sendReportEmail(adminEmails, filePath);
            }

            fs.unlinkSync(filePath);

            console.log('Report generated and sent successfully');
        } catch (error) {
            console.error('Failed to generate and send report:', error);
        }
    }
}
