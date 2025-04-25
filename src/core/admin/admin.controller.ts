import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { HowItWorkssDto, TestimonialArrsDto, UpdateAdminDto, UpdateHeroDto } from "./dto/admin.dto";
import { GetCurrentUserId } from "src/decorators/get-current-user-id.decorator";
import { Public } from "src/decorators/public.decorator";
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller("admin")
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }

    @Get()
    @HttpCode(HttpStatus.CREATED)
    async createAdmin(
        @GetCurrentUserId() userId: string
    ) {
        return await this.adminService.getAdmin({ _id: userId })
    }

    @Delete(":id")
    @HttpCode(HttpStatus.CREATED)
    async deleteAdmin(
        @Param("id") id: string
    ) {
        return await this.adminService.deleteAdmin(id)
    }

    @Patch("")
    @HttpCode(HttpStatus.CREATED)
    async updateAdmin(
        @GetCurrentUserId() userId: string,
        @Body() body: UpdateAdminDto
    ) {
        return await this.adminService.editAdmin(userId, body)
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post("how-it-works")
    async updateHowItWorks(@Body() body: HowItWorkssDto) {
        return await this.adminService.updateHowItWorks(body)
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Get("landing-content")
    async landingContent() {
        return await this.adminService.getAllLanding()
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Get("landing-seed")
    async seet() {
        return await this.adminService.landingSeed()
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post("hero-section")
    @UseInterceptors(FileInterceptor('hero_image'))
    async updateHero(
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
        ) hero_image: Express.Multer.File,
        @Body() { hero_text }: UpdateHeroDto) {
        return await this.adminService.updateHero(hero_text, hero_image)
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post("testimonials")
    @UseInterceptors(AnyFilesInterceptor())
    async updateTestimonials(
        @UploadedFiles() images: Express.Multer.File[],
        @Body() payload: TestimonialArrsDto) {
        return await this.adminService.updateTestimonial(payload, images)
    }
}