import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class BlogDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    html_template: string;

    @IsNotEmpty()
    @IsString()
    body_content_text: string;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    category: string;
}

export class EditBlogDto extends PartialType(BlogDto) {}

export class CategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class ParamsTitleDto {
    @IsNotEmpty()
    @IsString()
    title: string;
}

export class ParamsNameDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class ParamsIDDto {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    id: string;
}