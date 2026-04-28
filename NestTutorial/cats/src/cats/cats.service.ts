import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Cat } from './domain/cat.interface';
import { CatColor } from './domain/cats.color.enum';
import { CreateCatDto } from './dto/createCat.dto';
import { ColorNotFoundException } from './exceptions/color-not-found.exception';
import { CatsInMemoryRepository } from './repo/catsInMemory.repository';

@Injectable()
export class CatsService {
  constructor(private readonly repo: CatsInMemoryRepository) {}

  create(catDto: CreateCatDto) {
    const newCat: Cat = {
      id: uuid(),
      name: catDto.name,
      age: catDto.age,
      color: catDto.color,
    };

    this.repo.save(newCat);

    return { message: 'cat created', id: newCat.id };
  }

  update(id: string, catDto: CreateCatDto) {
    const cat = this.repo.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    const toUpdateCat: Cat = {
      id: cat.id,
      name: catDto.name,
      age: catDto.age,
      color: catDto.color,
    };

    this.repo.update(toUpdateCat.id, toUpdateCat);

    return { message: 'cat updated', id };
  }

  remove(id: string) {
    const cat = this.repo.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    this.repo.remove(id, cat.color);

    return { message: 'Cat deleted', id };
  }

  findAll() {
    return this.repo.findAll();
  }

  filterByColor(color: CatColor) {
    const cats = this.repo.filterByColor(color);

    if (cats.length === 0) {
      throw new ColorNotFoundException(color);
    }

    return cats;
  }

  findOne(id: string) {
    const cat = this.repo.findOne(id);
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    return cat;
  }
}
