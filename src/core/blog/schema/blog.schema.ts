import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/database/base.schema";
import { Schema as MSchema } from 'mongoose';
import { Admin } from "src/core/admin/schema/admin.schema";

@Schema()
export class Category extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String, unique: true })
    name: string;
}

@Schema()
export class Blog extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String, unique: true })
    title: string;

    @Prop({ required: true, type: MSchema.Types.String })
    featured_image: string;

    @Prop({ type: MSchema.Types.String, enum: ["Public", "Draft"], default: "Public" })
    status: string;

    @Prop({ type: MSchema.Types.String, required: true })
    html_template: string;

    @Prop({ type: MSchema.Types.String, required: true })
    body_content_text: string;

    @Prop({ type: MSchema.Types.ObjectId, required: true, ref: "Admin" })
    author: Admin;

    @Prop({ type: MSchema.Types.ObjectId, required: true, ref: "Category" })
    category: Category;
}


export const BlogSchema = SchemaFactory.createForClass(Blog);
export const CategorySchema = SchemaFactory.createForClass(Category);

