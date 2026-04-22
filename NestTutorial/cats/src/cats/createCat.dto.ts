import { IsString, IsNotEmpty, IsNumber, IsBoolean } from "class-validator";

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  color: string;
}