import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { user_type } from "../schema/admin.schema";

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