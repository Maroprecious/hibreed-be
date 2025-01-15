import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/database/base.schema";
import { Schema as MSchema } from 'mongoose';
import { ModuleDto } from "../dto/course.dto";

export enum course_categories {
    "master class" = "master classes",
    "accelerator courses" = "accelerator courses"
}

@Schema()
export class Course extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String, unique: true })
    title: string;

    @Prop({ required: true, type: MSchema.Types.String, enum: Object.values(course_categories) })
    category: `${course_categories}`;

    @Prop({ required: true, type: MSchema.Types.String })
    description: string;

    @Prop({ required: true, type: MSchema.Types.String })
    overview: string;

    @Prop({ required: true, type: MSchema.Types.String })
    image: string;

    @Prop([{ required: true, type: MSchema.Types.Array }])
    modules: ModuleDto[];

    @Prop({ required: true, type: MSchema.Types.String })
    duration: string;

    @Prop({ type: MSchema.Types.Number })
    hours_per_week: number;

    @Prop({ type: MSchema.Types.Number })
    number_of_modules: number;

    @Prop({ type: MSchema.Types.Number })
    course_fee: number;

    @Prop({ type: MSchema.Types.String })
    youtube_url: string;

    @Prop([{ type: MSchema.Types.Array }])
    addons: Array<Record<string, string>>;
}

@Schema()
export class Module extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String })
    title: string;

    @Prop({ required: true, type: MSchema.Types.String })
    description: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
export const ModuleSchema = SchemaFactory.createForClass(Module);