import { Injectable } from '@nestjs/common';
import { Cat } from './interface/cat.interface';
import { CreateCatDto } from './dto/createCat.dto';
import { CatColor } from "./enum/cats.color.enum";
import { FilterCatDto } from './dto/filterCatColor.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CatsService {
  private readonly catsById: Map<string,Cat> = new Map<string,Cat>();
  private readonly catsByColor: Map<string, Set<string>> = new Map<string, Set<string>>();

  create(catDto: CreateCatDto) {
    const newCat: Cat = {
    id: uuid(),
    name: catDto.name,
    age: catDto.age,
    color: catDto.color,
  };
  this.catsById.set(newCat.id, newCat)

  if (!this.catsByColor.has(newCat.color)) {
    this.catsByColor.set(newCat.color, new Set());
  }
  
  this.catsByColor.get(newCat.color)!.add(newCat.id);
  return {message:"cat created", id:newCat.id};
}

  update(id:string, CreateCatDto: CreateCatDto) {
    const cat = this.catsById.get(id);
    if (!cat) return "this cat don't exist"; 
    
    cat.name=CreateCatDto.name;
    cat.age=CreateCatDto.age;
    cat.color=CreateCatDto.color;
    return {message:"cat updated",id:id};
  };

  findAll() {
    return Array.from(this.catsById.values());
  }

  findByColor(color:CatColor){
    const ids = this.catsByColor.get(color);
    if (!ids) return 'no cats with this color';
    return Array.from(ids).map(id => this.catsById.get(id)!);
  }

  findOne(id: string){
    const cat = this.catsById.get(id);
    if (!cat) return "this cat don't exist"; 
    return this.catsById.get(id);
  }

  remove(id: string) {
    const cat = this.catsById.get(id);
    if (!cat) return "this cat don't exist"; 
    this.catsById.delete(id);
    this.catsByColor.get(cat.color)?.delete(id);
	  return {message: 'Cat deleted', id};
  }
}