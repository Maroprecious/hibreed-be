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

    public async createCourse(
        payload: CourseDto,
        file: Buffer,
        certificateBuffer?: Buffer,
        tutorImages?: Express.Multer.File[]
    ) {
        const course = await this.course.findOne({ title: payload.title })?.populate("modules")
        if (course) throw new BadRequestException(`Course with ${payload.title} already exists`)
        const image = await this.cloudinaryService.uploadImage(file)
        const certificate = certificateBuffer
            ? await this.cloudinaryService.uploadImage(certificateBuffer)
            : "";

        if (tutorImages?.length && payload.tutors?.length) {
            const uploadTutorImages = tutorImages.map(async (image, index) => {
                if (payload.tutors[index]) {
                    payload.tutors[index].image = await this.cloudinaryService.uploadImage(image.buffer);
                }
            });
            await Promise.all(uploadTutorImages);
        }
        await this.course.create({
            ...payload,
            certificate,
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

    public async editCourse(
        id: string,
        payload: EditCourseDto,
        file?: Buffer,
        certificateBuffer?: Buffer,
        tutorImages?: Express.Multer.File[]
    ) {
        try {
            const course = await this.course.findById(id);
            if (!course) throw new BadRequestException("Course not found")
            const data: any = { ...payload };
            if (file) {
                const image = await this.cloudinaryService.uploadImage(file)
                data.image = image
            }
            if (certificateBuffer) {
                const certificate = await this.cloudinaryService.uploadImage(certificateBuffer);
                data.certificate = certificate
            }
            if (tutorImages?.length && data.tutors?.length) {
                const uploadTutorImages = tutorImages.map(async (image, index) => {
                    if (data.tutors[index]) {
                        data.tutors[index].image = await this.cloudinaryService.uploadImage(image.buffer);
                    }
                });
                await Promise.all(uploadTutorImages);
            }
            await this.course.updateOne({ _id: id }, data);
            return "Course updated successfully"
        } catch (error) {
            throw new BadRequestException(error)
        }
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