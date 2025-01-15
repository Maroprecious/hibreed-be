import { Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, Matches, MinLength, ValidateNested, IsEnum, Min, ArrayMinSize, IsNumberString, IsOptional } from "class-validator";
import { OmitType, PartialType } from "@nestjs/mapped-types"
import { course_categories } from "../schema/course.schema";

class CourseAddons {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    value: string;
}

export class ModuleDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true, message: 'Each description must be a string.' })
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    descriptions: string
}

export class CourseDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    youtube_url: string

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CourseAddons)
    addons: CourseAddons[]

    @IsString()
    @IsNotEmpty()
    @IsEnum(course_categories)
    category: `${course_categories}`

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    description: string

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    overview: string

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d+\s(weeks|days|months|years)$/, {
        message: 'Duration must be in the format "{number} weeks | days | months | years"',
    })
    duration: string

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    hours_per_week: string

    @IsNotEmpty()
    @Transform(({ value }) => {
        return Number(value)
    })
    @IsNumber()
    course_fee: string

    @Type(() => ModuleDto)
    @ValidateNested({ each: true })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    modules: ModuleDto[]
}



export class EditCourseDto extends PartialType(CourseDto) { }