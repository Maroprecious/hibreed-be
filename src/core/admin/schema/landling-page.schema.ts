import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/database/base.schema";
import { Schema as MSchema } from 'mongoose';


@Schema()
export class LandingPage extends BaseSchema {
    @Prop({ type: MSchema.Types.String })
    hero_image: string;

    @Prop({ type: MSchema.Types.String })
    hero_text: string;

    @Prop({ type: MSchema.Types.Array })
    how_it_works: Record<string, string>[];

    @Prop({ type: [MSchema.Types.ObjectId], ref: "Testimonials" })
    testimonials: Testimonials[]
}

@Schema()
export class Testimonials extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String })
    image: string;

    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: true, type: MSchema.Types.String })
    content: string;
}

export const LandingPageSchema = SchemaFactory.createForClass(LandingPage);
export const TestimonialsSchema = SchemaFactory.createForClass(Testimonials);