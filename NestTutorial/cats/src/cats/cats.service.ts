import { Injectable } from '@nestjs/common';
import { Cat } from './interface/cat.interface';
import { CreateCatDto } from './dto/createCat.dto';
import { CatColor } from "./enum/cats.color.enum";
import { FilterCatDto } from './dto/filterCatColor.dto';
import { v4 as uuid } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { ColorNotFoundException } from './exceptions/color-not-found.exception'
import { CatsRepository } from './repo/cats.repository'


@Injectable()
export class CatsService {
  constructor(private readonly repo: CatsRepository) {}

  create(catDto: CreateCatDto) {
    
    const newCat: Cat = {
    id: uuid(),
    name: catDto.name,
    age: catDto.age,
    color: catDto.color,
  };
  
  this.repo.save(newCat);

  return {message:"cat created", id:newCat.id};
}

  update(id:string, CatDto: CreateCatDto) {
    const cat = this.repo.findOne(id);
    if (!cat)
    {
      throw new NotFoundException(`Cat with id ${id} not found`);
    } 

    const toUpdateCat : Cat={
      id: cat.id,
      name: CatDto.name,
      age: CatDto.age,
      color: CatDto.color,
    };
    
    this.repo.update(toUpdateCat.id, toUpdateCat);
  
    return {message:"cat updated",id:id};
  };

  remove(id: string) {
    const cat = this.repo.findOne(id);
    if (!cat)
    {
      throw new NotFoundException(`Cat with id ${id} not found`);
    } 
    this.repo.remove(id,cat);
	  return {message: 'Cat deleted', id};
  }

  findAll() {
    return this.repo.findAll();
  }

  filterByColor(color:CatColor){
    const cats = this.repo.filterByColor(color);

    if (cats.length === 0) {
      throw new ColorNotFoundException(color);
    }

    return cats;
  }

  findOne(id: string){
    const cat = this.repo.findOne(id);
    if (!cat)
    {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    return cat;
  }
}