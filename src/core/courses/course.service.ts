import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Course, Module } from "./schema/course.schema";
import { Model } from "mongoose";
import { CourseDto, EditCourseDto, ModuleDto } from "./dto/course.dto";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(Course.name)
        private course: Model<Course>,
        @InjectModel(Module.name)
        private module: Model<Module>,
        private cloudinaryService: CloudinaryService
    ) { }

    public async createCourse(payload: CourseDto, file: Buffer) {
        const course = await this.course.findOne({ title: payload.title })?.populate("modules")
        if (course) throw new BadRequestException(`Course with ${payload.title} already exists`)
        const image = await this.cloudinaryService.uploadImage(file)
        await this.course.create({
            ...payload,
            image
        })
        return "Course created successfully"
    }

    public async getAllCourse() {
        return await this.course.find().populate("modules")
    }

    public async getOneCourse(title: string) {
        const course = await this.course.findOne({ title })?.populate("modules")
        if (!course) throw new BadRequestException(`Course with ${title} does not exists`)

        return course
    }

    public async editCourse(id: string, payload: EditCourseDto, file?: Buffer) {
        const course = await this.course.findById(id);
        if (!course) throw new BadRequestException("Course not found")
        const data: any = { ...payload };
        if (file) {
            const image = await this.cloudinaryService.uploadImage(file)
            data.image = image
        }
        await this.course.updateOne({ _id: id }, data);
        return "Course updated successfully"
    }

    public async deleteCourse(title: string) {
        const course = await this.getOneCourse(title);

        await this.course.deleteOne({ title })

        return "Course deleted successfully"
    }

    public async getAllModules(title: string) {
        const course = await this.getOneCourse(title);
        return course.modules
    }

    public async deleteModule(id: string) {
        const module = await this.module.findById(id);
        if (!module) throw new BadRequestException("Module not found");
        await this.module.deleteOne({ _id: id })
        return "Module deleted successfully"
    }

    public async editModule(id: string, payload: ModuleDto) {
        const module = await this.module.findById(id);
        if (!module) return module;
        await this.module.updateOne({ _id: id }, payload)
        return "Module edited successfully"
    }
}