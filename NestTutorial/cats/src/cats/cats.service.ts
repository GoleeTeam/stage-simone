import { Injectable } from '@nestjs/common';
import { Cat } from './interface/cat.interface';
import { CreateCatDto } from './dto/createCat.dto';
import { CatColor } from "./enum/cats.color.enum";
import { FilterCatDto } from './dto/filterCatColor.dto';
import { v4 as uuid } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { ColorNotFoundException } from './exceptions/color-not-found.exception'


@Injectable()
export class CatsService {
  private readonly catsById: Map<string,Cat> = new Map<string,Cat>();
  private readonly catsByColor: Map<CatColor, Set<string>> = new Map();

  create(catDto: CreateCatDto) {
    const newCat: Cat = {
    id: uuid(),
    name: catDto.name,
    age: catDto.age,
    color: catDto.color,
  };
  this.catsById.set(newCat.id, newCat)

  this.AddcatsByColor(newCat);
  return {message:"cat created", id:newCat.id};
}

  update(id:string, CatDto: CreateCatDto) {
    const cat = this.catsById.get(id);
    if (!cat)
    {
      throw new NotFoundException(`Cat with id ${id} not found`);
    } 

    const updatedCat : Cat={
      id: cat.id,
      name: CatDto.name,
      age: CatDto.age,
      color: CatDto.color,
    };
    this.catsById.set(id, updatedCat);
    
    this.catsByColor.get(cat.color)?.delete(id);
    this.AddcatsByColor(updatedCat);
  
    return {message:"cat updated",id:id};
  };

  AddcatsByColor(cat:Cat)
  {
    if (!this.catsByColor.has(cat.color)) {
      this.catsByColor.set(cat.color, new Set());
    }
    this.catsByColor.get(cat.color)!.add(cat.id);
  }

  findAll() {
    return Array.from(this.catsById.values());
  }

  findByColor(color:CatColor){
    const ids = this.catsByColor.get(color);
    if (!ids || ids.size === 0)
    {
      throw new ColorNotFoundException(color);
    }
    return Array.from(ids).map(id => this.catsById.get(id)!);
  }

  findOne(id: string){
    const cat = this.catsById.get(id);
    if (!cat)
    {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    return cat;
  }

  remove(id: string) {
    const cat = this.catsById.get(id);
    if (!cat)
    {
       throw new NotFoundException(`Cat with id ${id} not found`);
    }
    this.catsById.delete(id);
    this.catsByColor.get(cat.color)?.delete(id);
	  return {message: 'Cat deleted', id};
  }
}