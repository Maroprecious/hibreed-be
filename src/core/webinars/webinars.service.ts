import { BadRequestException, Injectable } from "@nestjs/common";
import { WebinarAttendeeDto, WebinarDto } from "./dto/webinars.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Webinar, WebinarAttendees } from "./schema/webinars.schema";
import { Model } from "mongoose";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class WebinarService {
    constructor(
        @InjectModel(Webinar.name)
        private webinarModel: Model<Webinar>,
        @InjectModel(WebinarAttendees.name)
        private webinarAttendeeModel: Model<WebinarAttendees>,
        private cloudinaryService: CloudinaryService,
        private notificationService: NotificationService
    ) { }

    public async createWebinars(payload: WebinarDto & { feature_image: Buffer },) {
        const webinar = await this.webinarModel.findOne({ title: payload.title });
        if (webinar) throw new BadRequestException(`Webinar with title - ${payload.title} already exist`);

        const speakers = await Promise.all(
            payload.speakers.map(async (speaker) => {
                const speaker_image = await this.cloudinaryService.uploadImage(speaker.image);
                return {
                    ...speaker,
                    image: speaker_image
                }
            })
        )
        const feature_image = await this.cloudinaryService.uploadImage(payload.feature_image)
        delete payload.speakers;

        await this.webinarModel.create({
            ...payload,
            speakers: speakers.flat(),
            feature_image
        })
        return "Webinar created successfully"
    }

    public async editWebinar(
        payload: Partial<WebinarDto & { feature_image: Buffer }>,
        id: string
    ) {
        const webinar = await this.webinarModel.findById(id);
        if (!webinar) throw new BadRequestException(`Webinar does not exist`);
        const data: any = { ...payload }
        if (payload.speakers) {
            const speakers = await Promise.all(
                payload.speakers.map(async (speaker) => {
                    const speaker_image = await this.cloudinaryService.uploadImage(speaker.image);
                    return {
                        ...speaker,
                        image: speaker_image
                    }
                })
            )
            data.speakers = speakers
            delete payload.speakers;
        }
        if (payload.feature_image) {
            const feature_image = await this.cloudinaryService.uploadImage(payload.feature_image);
            data.feature_image = feature_image
        }
        await this.webinarModel.updateOne({ _id: id }, { ...data, speakers: data.speakers.flat() })
        return "Webinar Edited successfully"
    }

    public async getAllWebinars() {
        return await this.webinarModel.find()
    }

    public async getOneWebinar(title: string) {
        const webinar = await this.webinarModel.findOne({ title });
        if (!webinar) throw new BadRequestException(`Webinar with title - ${title} does not exist`);
        return webinar
    }

    public async deleteOneWebinar(title: string) {
        const webinar = await this.webinarModel.findOne({ title });
        if (!webinar) throw new BadRequestException(`Webinar with title - ${title} does exist`);
        await this.webinarModel.deleteOne({ title })
        return "Webinar deleted successfully"
    }

    public async registerForAWebinar(payload: WebinarAttendeeDto) {
        const webinar = await this.webinarModel.findById(payload.webinar);
        if (!webinar) throw new BadRequestException(`Webinar does not exist`)
        const attendee = await this.webinarAttendeeModel.findOne({ email: payload.email, webinar: payload.webinar });

        if (attendee) throw new BadRequestException(`${payload.email} already registered for this event`);
        const new_attendee = new this.webinarAttendeeModel({ ...payload, webinar });
        await new_attendee.save()
        await this.notificationService.sendEmail({
            to: payload.email,
            template: "./user/webinar-attendee",
            subject: "Webinar seat reserved",
            context: {
                name: payload.name,
                details: [
                    {
                        key: "Title",
                        value: webinar.title
                    }, {
                        key: "Date",
                        value: new Date(webinar.date).toLocaleDateString()
                    }, {
                        key: "Time",
                        value: webinar.time
                    }, {
                        key: "Fee",
                        value: webinar.fee
                    },
                    {
                        key: "Location",
                        value: webinar.location
                    },
                ],
                speakers: webinar.speakers
            }
        })
        return "Registered for webinar succcessfully"
    }

    public async getAllWebinarAttendees(webinar: string) {
        return await this.webinarAttendeeModel.find({ webinar })
    }
}