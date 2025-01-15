import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema, Category, CategorySchema } from "./schema/blog.schema";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { CloudinaryModule } from "src/common/cloudinary/cloudinary.module";

@Module({
    imports: [
        CloudinaryModule,
        MongooseModule.forFeature([
            {
                name: Blog.name,
                schema: BlogSchema
            },
            {
                name: Category.name,
                schema: CategorySchema
            },
        ])
    ],
    controllers: [BlogController],
    providers: [BlogService]
})
export class BlogModule { }