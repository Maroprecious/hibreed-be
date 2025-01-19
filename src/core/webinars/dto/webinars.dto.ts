import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { isArrayBuffer } from "util/types";

class ImageDto {
    @IsString()
    @IsNotEmpty()
    fieldname: string

    @IsString()
    @IsNotEmpty()
    originalname: string

    @IsString()
    @IsNotEmpty()
    encoding: string

    @IsString()
    @IsNotEmpty()
    mimetype: string

    @IsString()
    @IsNotEmpty()
    buffer: string
}

export class WebinarSpeakers {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    bio: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    image: Buffer
}



export class WebinarAttendeeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone_number: string;

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    webinar: string;
}


export class WebinarDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true, message: 'Each overview must be a string.' })
    overview: string;

    @IsNotEmpty()
    @IsArray()
    @Type(() => WebinarSpeakers)
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    speakers: WebinarSpeakers[];

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    fee: string;
}

export class EditWebinarDto extends PartialType(WebinarDto) {}