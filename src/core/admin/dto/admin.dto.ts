import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { user_type } from "../schema/admin.schema";
import { Type } from "class-transformer";

export class CreasteAdminDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsNotEmpty()
    last_name: string

    @IsString()
    @IsNotEmpty()
    phone_number: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    @IsEnum(user_type)
    role: string
}

export class UpdateAdminDto {
    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsNotEmpty()
    last_name: string

    @IsString()
    @IsNotEmpty()
    phone_number: string
}

export class LoginDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class ResetRequestDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string
}

export class VerifyAccountDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    code: string
}

export class UpdateRequestDto extends VerifyAccountDto {
    @IsString()
    @IsNotEmpty()
    password: string


}

export class UpdateHeroDto {
    @IsNotEmpty()
    @IsString()
    hero_text: string
}

export class TestDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    sub_text: string
}

export class HowItWorkssDto {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(4)
    @ValidateNested({ each: true })
    @Type(() => TestDto)
    how_it_works: TestDto[]
}

export class TestimonialsDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    content: string

    @IsNotEmpty()
    @IsString()
    linkedInUrl: string

    @IsNotEmpty()
    @IsString()
    career: string
}


export class TestimonialArrsDto {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TestimonialsDto)
    testimonials: TestimonialsDto[]
}
