import { IsNotEmpty, IsString } from "class-validator";

export class JobsDto {
    @IsNotEmpty()
    @IsString()
    job_title: string

    @IsNotEmpty()
    @IsString()
    application_url: string


    @IsNotEmpty()
    @IsString()
    html_template: string


    @IsNotEmpty()
    @IsString()
    body_content_text: string
}