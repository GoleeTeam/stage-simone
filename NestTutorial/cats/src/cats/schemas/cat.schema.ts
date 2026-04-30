import { Prop,Schema,SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument=HydratedDocument<Cat>;

@Schema()
export class Cat {
@Prop()
  id!:string;

@Prop()
  name!:string;

@Prop()
  age!:number;

@Prop()
  color!:string;
}
export const CatSchema = SchemaFactory.createForClass(Cat);