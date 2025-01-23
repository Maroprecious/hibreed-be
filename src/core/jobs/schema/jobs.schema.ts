import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/database/base.schema";
import { Schema as MSchema } from 'mongoose';

@Schema()
export class Jobs extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String })
    job_title: string;

    @Prop({ required: true, type: MSchema.Types.String })
    image: string;

    @Prop({ required: true, type: MSchema.Types.String })
    application_url: string;

    @Prop({ required: true, type: MSchema.Types.String })
    html_template: string;

    @Prop({ type: MSchema.Types.String, required: true })
    body_content_text: string;
}

export const JobsSchema = SchemaFactory.createForClass(Jobs);
