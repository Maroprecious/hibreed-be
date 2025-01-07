import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/database/base.schema";
import { Schema as MSchema } from 'mongoose';
import { Admin } from "../admin/schema/admin.schema";

export enum otp_type {
    'RESET_PASSWORD' = "RESET_PASSWORD",
    "CREATE_PASSWORD" = "CREATE_PASSWORD"
}

@Schema()
export class OTP extends BaseSchema {
    @Prop({ required: true, type: MSchema.Types.ObjectId, ref: "Admin" })
    admin: Admin;

    @Prop({ required: true, type: MSchema.Types.String })
    otp: string;

    @Prop({ required: true, type: MSchema.Types.String })
    token: string;

    @Prop({ required: true, type: MSchema.Types.String, enum: Object.keys(otp_type), default: otp_type.CREATE_PASSWORD })
    type: `${otp_type}`;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
