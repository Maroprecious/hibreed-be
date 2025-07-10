import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/database/base.schema";
import { Schema as MSchema } from 'mongoose';


@Schema()
export class AboutUs extends BaseSchema {
    @Prop({ type: MSchema.Types.String })
    title: string;

    @Prop({ type: MSchema.Types.String })
    hero_image: string;

    @Prop({ type: MSchema.Types.String })
    sub_title: string;

    @Prop({ type: [MSchema.Types.ObjectId], ref: "Body" })
    body: Body[];
}

@Schema()
export class Body extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String })
    image: string;

    @Prop({ required: true, type: MSchema.Types.String })
    title: string;

    @Prop({ required: true, type: [MSchema.Types.String] })
    content: string[];
}


export const AboutUsSchema = SchemaFactory.createForClass(AboutUs);
export const BodySchema = SchemaFactory.createForClass(Body);
