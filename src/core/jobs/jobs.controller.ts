import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    UploadedFile,
    UseInterceptors,
    ParseFilePipe,
    FileTypeValidator,
    HttpCode,
    HttpStatus
} from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { JobsDto } from "./dto/jobs.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "src/decorators/public.decorator";

@Controller("jobs")
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async createJob(
        @Body() payload: JobsDto,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: true,
                validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
            })
        )
        file: Express.Multer.File
    ) {
        return await this.jobsService.createJob(payload, file.buffer);
    }

    @Public()
    @Get()
    async getAllJobs() {
        return await this.jobsService.getAllJobs();
    }

    @Public()
    @Get(":title")
    async getJobById(@Param("title") title: string) {
        return await this.jobsService.getJobById(title);
    }

    @Put(":id")
    @UseInterceptors(FileInterceptor("file"))
    async updateJob(
        @Param("id") id: string,
        @Body() payload: JobsDto,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: false,
                validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
            })
        )
        file?: Express.Multer.File
    ) {
        return await this.jobsService.updateJob(id, payload, file?.buffer);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteJob(@Param("id") id: string) {
        await this.jobsService.deleteJob(id);
    }
}
