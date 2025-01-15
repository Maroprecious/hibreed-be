import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Webinar, WebinarAttendees, WebinarAttendeesSchema, WebinarSchema } from "./schema/webinars.schema";
import { WebinarController } from "./webinars.controller";
import { WebinarService } from "./webinars.service";
import { CloudinaryModule } from "src/common/cloudinary/cloudinary.module";
import { NotificationModule } from "../notification/notification.module";
import { NotificationService } from "../notification/notification.service";

@Module({
    imports: [
        CloudinaryModule,
        MongooseModule.forFeature([
            {
                name: Webinar.name,
                schema: WebinarSchema
            },
            {
                name: WebinarAttendees.name,
                schema: WebinarAttendeesSchema
            },
        ])
    ],
    controllers: [WebinarController],
    providers: [WebinarService, NotificationService]
})
export class WebinarsModule { }