import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { EditWebinarDto, WebinarAttendeeDto, WebinarDto } from "./dto/webinars.dto";
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { FileNameRegexInterceptor } from "src/interceptors/file.interceptor";
import { WebinarService } from "./webinars.service";
import { ParamsIDDto, ParamsTitleDto } from "../blog/dto/blog.dto";

@Controller("webinar")
export class WebinarController {
    constructor(
        private webinarService: WebinarService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(AnyFilesInterceptor())
    async createWebinar(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: WebinarDto
    ) {
        try {
            const feature_image = files.find((file) => file.fieldname === "feature_image");
            if (!feature_image) throw new BadRequestException("feature_image is required");
            const speaker_images = files.filter((file) => file.fieldname.includes("speakers") && /\b(jpeg|jpg|png)\b/i.test(file.mimetype))
            if (speaker_images.length !== body.speakers.length) throw new BadRequestException("Image required for all speakers")
            const data: WebinarDto = { ...body }
            body.speakers.map((speaker, idx) => {
                const image_buffer = files.find((file) => file.fieldname === `speakers[${idx}][image]`)

                data.speakers[idx].image = image_buffer.buffer
            })
            return this.webinarService.createWebinars(
                { ...data, feature_image: feature_image.buffer }
            )
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllWebinars() {
        return await this.webinarService.getAllWebinars()
    }

    @Get(":title")
    @HttpCode(HttpStatus.OK)
    async getOneWebinar(
        @Param() { title }: ParamsTitleDto
    ) {
        return await this.webinarService.getOneWebinar(title)
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll(
    ) {
        return await this.webinarService.getAllWebinars()
    }

    @Put("attendees")
    @HttpCode(HttpStatus.OK)
    async webinarAttendee(
        @Body() body: WebinarAttendeeDto
    ) {
        return await this.webinarService.registerForAWebinar(body)
    }

    @Get(":id/attendees")
    @HttpCode(HttpStatus.OK)
    async getAllWebinarAttendee(
        @Param() { id }: ParamsIDDto
    ) {
        return await this.webinarService.getAllWebinarAttendees(id)
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AnyFilesInterceptor())
    async editWebinar(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: EditWebinarDto,
        @Param() param: ParamsIDDto
    ) {
        try {
            const data: any = { ...body }
            const feature_image = files.find((file) => file.fieldname === "feature_image");
            if (feature_image) {
                data.feature_image = feature_image.buffer
            }
            const speaker_images = files.filter((file) => file.fieldname.includes("speakers") && /\b(jpeg|jpg|png)\b/i.test(file.mimetype))
            if (body.speakers) {
                if (body?.speakers.length && speaker_images.length !== body.speakers.length) throw new BadRequestException("Image required for all speakers")
                body?.speakers.map((speaker, idx) => {
                    const image_buffer = files.find((file) => file.fieldname === `speakers[${idx}][image]`)
                    data.speakers[idx].image = image_buffer.buffer
                })
            }
            return this.webinarService.editWebinar(
                { ...data },
                param.id
            )
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    @Delete(":title")
    @HttpCode(HttpStatus.OK)
    async deleteWebinar(
        @Param() { title }: ParamsTitleDto
    ) {
        return await this.webinarService.deleteOneWebinar(title)
    }
}