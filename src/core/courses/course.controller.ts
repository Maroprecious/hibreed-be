import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseDto, EditCourseDto, ModuleDto } from "./dto/course.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("course")
export class CourseController {
    constructor(
        private courseService: CourseService
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.CREATED)
    async courseCreated(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /jpeg|jpg|png/,
                })
                .addMaxSizeValidator({
                    maxSize: 5 * 1024 * 1024
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: true
                }),
        ) image: Express.Multer.File,
        @Body() body: CourseDto
    ) {
        return await this.courseService.createCourse(body, image.buffer)
    }

    @Get()
    @HttpCode(HttpStatus.CREATED)
    async getAllCourses(
    ) {
        return await this.courseService.getAllCourse()
    }

    @Patch(":id")
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.CREATED)
    async editCourse(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /jpeg|jpg|png/,
                })
                .addMaxSizeValidator({
                    maxSize: 5 * 1024 * 1024
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: false
                }),
        ) image: Express.Multer.File,
        @Body() body: EditCourseDto,
        @Param("id") id: string
    ) {
        return await this.courseService.editCourse(id, body, image.buffer)
    }

    @Get(":title")
    @HttpCode(HttpStatus.CREATED)
    async getOneCourse(
        @Param("title") title: string
    ) {
        return await this.courseService.getOneCourse(title)
    }

    @Delete(":title")
    @HttpCode(HttpStatus.CREATED)
    async deleteCourse(
        @Param("title") title: string
    ) {
        return await this.courseService.deleteCourse(title)
    }

    @Get(":title/modules")
    @HttpCode(HttpStatus.CREATED)
    async getCourseModules(
        @Param("title") title: string
    ) {
        return await this.courseService.getAllModules(title)
    }

    @Delete(":id/module")
    @HttpCode(HttpStatus.CREATED)
    async deleteCourseModules(
        @Param("id") id: string
    ) {
        return await this.courseService.deleteModule(id)
    }

    @Patch(":id/module")
    @HttpCode(HttpStatus.CREATED)
    async deleteModule(
        @Param("id") id: string,
        @Body() body: ModuleDto
    ) {
        return await this.courseService.editModule(id, body)
    }
}