import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseDto, EditCourseDto, ModuleDto } from "./dto/course.dto";
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Public } from "src/decorators/public.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { user_type } from "../admin/schema/admin.schema";

@Controller("course")
export class CourseController {
    constructor(
        private courseService: CourseService
    ) { }

    @Roles(user_type.ADMIN)
    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    @HttpCode(HttpStatus.CREATED)
    async courseCreated(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: CourseDto
    ) {
        const image = files.find((file) => file.fieldname === "image");
        if (!image) {
            throw new BadRequestException('Image file is required');
        }
        const imageFile = image;
        if (!/jpeg|jpg|png/.test(imageFile.mimetype)) {
            throw new BadRequestException('Invalid image file type. Only JPEG, JPG, and PNG are allowed.');
        }
        if (imageFile.size > 5 * 1024 * 1024) {
            throw new BadRequestException('Image file size exceeds the 5MB limit.');
        }
        const certificate = files.find((file) => file.fieldname === "certificate");

        if (certificate) {
            const certificateFile = certificate;
            if (!/jpeg|jpg|png/.test(certificateFile.mimetype)) {
                throw new BadRequestException('Invalid certificate file type. Only JPEG, JPG, and PNG are allowed.');
            }
            if (certificateFile.size > 5 * 1024 * 1024) {
                throw new BadRequestException('Certificate file size exceeds the 5MB limit.');
            }
        }
        const tutorImages = files.filter((file) => file.fieldname.includes("tutor"))

        return await this.courseService.createCourse(
            body,
            image.buffer,
            certificate?.buffer,
            tutorImages
        )
    }

    @Public()
    @Get()
    @HttpCode(HttpStatus.CREATED)
    async getAllCourses(
    ) {
        return await this.courseService.getAllCourse()
    }

    @Roles(user_type.ADMIN)
    @Patch(":id")
    @UseInterceptors(AnyFilesInterceptor())
    @HttpCode(HttpStatus.CREATED)
    async editCourse(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: EditCourseDto,
        @Param("id") id: string
    ) {
        const image = files.find((file) => file?.fieldname === "image");

        if (image) {
            const imageFile = image;
            if (!/jpeg|jpg|png/.test(imageFile.mimetype)) {
                throw new BadRequestException('Invalid image file type. Only JPEG, JPG, and PNG are allowed.');
            }
            if (imageFile.size > 5 * 1024 * 1024) {
                throw new BadRequestException('Image file size exceeds the 5MB limit.');
            }
        }
        const certificate = files.find((file) => file.fieldname === "certificate");

        if (certificate) {
            const certificateFile = certificate;
            if (!/jpeg|jpg|png/.test(certificateFile.mimetype)) {
                throw new BadRequestException('Invalid certificate file type. Only JPEG, JPG, and PNG are allowed.');
            }
            if (certificateFile.size > 5 * 1024 * 1024) {
                throw new BadRequestException('Certificate file size exceeds the 5MB limit.');
            }
        }
        const tutorImages = files.filter((file) => file.fieldname.includes("tutor"))

        return await this.courseService.editCourse(id, body, image?.buffer, certificate.buffer, tutorImages)
    }

    @Public()
    @Get(":title")
    @HttpCode(HttpStatus.CREATED)
    async getOneCourse(
        @Param("title") title: string
    ) {
        return await this.courseService.getOneCourse(title)
    }

    @Roles(user_type.ADMIN)
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