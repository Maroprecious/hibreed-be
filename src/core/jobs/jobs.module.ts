import { Module } from "@nestjs/common";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";
import { JobsSchema, Jobs } from "./schema/jobs.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { CloudinaryModule } from "src/common/cloudinary/cloudinary.module";

@Module({
    imports: [
        CloudinaryModule,
        MongooseModule.forFeature([
            {
                name: Jobs.name,
                schema: JobsSchema
            }
        ])],
    providers: [JobsService],
    controllers: [JobsController]
})
export class JobsModule { }