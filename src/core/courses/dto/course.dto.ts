import { Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, Matches, MinLength, ValidateNested, IsEnum, Min, ArrayMinSize, IsNumberString } from "class-validator";
import { OmitType } from "@nestjs/mapped-types"
import { course_categories } from "../schema/course.schema";


export class ModuleDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    description: string
}

export class CourseDto {
    @IsString()
    @IsNotEmpty()
    title: string

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

export class EditCourseDto extends OmitType(CourseDto, ["modules"]) { }