import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Schema } from 'mongoose';

export class BaseSchema implements BaseModel {

  @Transform(({ value }) => value.toString())
  _id?: string;

  _v?: number;
}
