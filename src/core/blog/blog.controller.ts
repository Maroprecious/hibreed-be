import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BlogDto, CategoryDto, EditBlogDto, ParamsIDDto, ParamsNameDto, ParamsTitleDto } from "./dto/blog.dto";
import { BlogService } from "./blog.service";
import { GetCurrentUserId } from "src/decorators/get-current-user-id.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("blog")
export class BlogController {
    constructor(
        private blogService: BlogService
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('featured_image'))
    @HttpCode(HttpStatus.CREATED)
    async createBlog(
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
        ) featured_image: Express.Multer.File,
        @Body() body: BlogDto, @GetCurrentUserId() user: string) {
        return await this.blogService.createBlog(body, user, featured_image.buffer)
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllBlogs() {
        return await this.blogService.getAllBlogs()
    }

    @Delete(":title")
    @HttpCode(HttpStatus.OK)
    async deleteBlog(
        @Param() { title }: ParamsTitleDto
    ) {
        return await this.blogService.deleteBlog(title)
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('featured_image'))
    async editBlog(
        @Param() { id }: ParamsIDDto,
        @Body() body: EditBlogDto,
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
        ) featured_image: Express.Multer.File,
    ) {
        return await this.blogService.editBlog(id, body, featured_image?.buffer)
    }



    @Post("category")
    @HttpCode(HttpStatus.CREATED)
    async createCategoty(@Body() body: CategoryDto) {
        return await this.blogService.createCategory(body)
    }

    @Get("category")
    @HttpCode(HttpStatus.OK)
    async getAllCategories() {
        return await this.blogService.getAllCategories()
    }

    @Get(":title")
    @HttpCode(HttpStatus.OK)
    async getOneBlog(
        @Param() { title }: ParamsTitleDto
    ) {
        return await this.blogService.getOneBlog(title)
    }

    @Delete(":title")
    @HttpCode(HttpStatus.OK)
    async deleteCategory(
        @Param() { name }: ParamsNameDto
    ) {
        return await this.blogService.deleteCategory(name)
    }
}