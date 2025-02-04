import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/database/base.schema";
import { Schema as MSchema } from 'mongoose';

export enum user_type {
    'ADMIN' = "ADMIN",
    "SUB ADMIN" = "SUB ADMIN"
}

@Schema()
export class Admin extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.String })
    email: string;

    @Prop({ required: true, type: MSchema.Types.String })
    first_name: string;

    @Prop({ required: true, type: MSchema.Types.String })
    last_name: string;

    @Prop({ required: true, type: MSchema.Types.String })
    password: string;

    @Prop({ required: true, type: MSchema.Types.Boolean, default: false })
    verified: boolean;

    @Prop({ required: true, type: MSchema.Types.String })
    phone_number: string;

    @Prop({type: MSchema.Types.String, required: true, enum: user_type,})
    role: `${user_type}`

}

export const AdminSchema = SchemaFactory.createForClass(Admin);
