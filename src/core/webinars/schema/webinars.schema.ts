import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/database/base.schema";
import { Schema as MSchema } from 'mongoose';
import { WebinarSpeakers } from "../dto/webinars.dto";

@Schema()
export class Webinar extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String, unique: true })
    title: string;

    @Prop({ required: true, type: MSchema.Types.Array })
    overview: string[];

    @Prop({ required: true, type: MSchema.Types.Array })
    speakers: WebinarSpeakers[]

    @Prop({ required: true, type: MSchema.Types.Date })
    date: Date;

    @Prop({ required: true, type: MSchema.Types.String })
    time: string;

    @Prop({ required: true, type: MSchema.Types.String })
    location: string;

    @Prop({ required: true, type: MSchema.Types.String })
    fee: string;

    @Prop({ required: true, type: MSchema.Types.String })
    feature_image: string;
}


@Schema()
export class WebinarAttendees extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: true, type: MSchema.Types.String })
    email: string;

    @Prop({ required: true, type: MSchema.Types.String })
    phone_number: string;

    @Prop({ required: true, type: MSchema.Types.ObjectId, ref: "Webinar" })
    webinar: Webinar
}


export const WebinarSchema = SchemaFactory.createForClass(Webinar);
export const WebinarAttendeesSchema = SchemaFactory.createForClass(WebinarAttendees);