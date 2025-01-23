import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Jobs } from "./schema/jobs.schema";
import { Model } from "mongoose";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";
import { JobsDto } from "./dto/jobs.dto";

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(Jobs.name)
        private jobs: Model<Jobs>,
        private cloudinaryService: CloudinaryService
    ) { }

    async createJob(payload: JobsDto, file: Buffer) {
        const job = await this.jobs.findOne({ job_title: payload.job_title });
        if (job) throw new BadRequestException(`Job with ${payload.job_title} already exists`);
        const image = await this.cloudinaryService.uploadImage(file);
        await this.jobs.create({ ...payload, image });
        return "Job created successfully";
    }

    async getAllJobs() {
        return await this.jobs.find();
    }

    async getJobById(job_title: string) {
        const job = await this.jobs.findOne({ job_title });
        if (!job) throw new NotFoundException("Job not found");
        return job;
    }

    async updateJob(id: string, payload: JobsDto, file?: Buffer) {
        const job = await this.jobs.findById(id);
        if (!job) throw new NotFoundException("Job not found");

        let image;
        if (file) {
            image = await this.cloudinaryService.uploadImage(file);
        }

        await this.jobs.findByIdAndUpdate(id, { ...payload, ...(image && { image }) });
        return "Job updated successfully";
    }

    async deleteJob(id: string) {
        const job = await this.jobs.findById(id);
        if (!job) throw new NotFoundException("Job not found");

        await this.jobs.findByIdAndDelete(id);
        return "Job deleted successfully";
    }
}
