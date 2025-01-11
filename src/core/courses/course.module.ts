import { Module } from "@nestjs/common"
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema, ModuleSchema, Module as CourseModules } from "./schema/course.schema";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Course.name,
                schema: CourseSchema
            },
            {
                name: CourseModules.name,
                schema: ModuleSchema
            },
        ])
    ],
    controllers: [CourseController],
    providers: [CourseService, CloudinaryService],
    exports: []
})
export class CourseModule { }