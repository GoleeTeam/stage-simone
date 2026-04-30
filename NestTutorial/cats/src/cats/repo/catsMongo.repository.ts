import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cat } from '../domain/cat.class';
import { CatColor } from '../domain/cats.color.enum';
import { CatsRepository } from '../repo/cats.repository';
import { CatDocument } from '../schemas/cat.schema';

@Injectable()
export class CatsMongoRepository implements CatsRepository {
  constructor(
    @InjectModel(Cat.name)
    private readonly catModel: Model<CatDocument>,
  ) {}

  async save(cat: Cat): Promise<void> {
    await this.catModel.create(cat);
  }

  async update(id: string, cat: Cat): Promise<void> {
    await this.catModel.updateOne({ _id: id }, cat);
  }

  async remove(id: string): Promise<void> {
    await this.catModel.deleteOne({ _id: id });
  }

  async findAll(): Promise<Cat[]> {
    const cats = await this.catModel.find().lean();

    return cats.map(cat => ({
        ...cat,
        color: cat.color as CatColor,
    }));
    }

  async findOne(id: string): Promise<Cat | undefined> {
    const cat = await this.catModel.findById(id).lean();
    if (!cat) return undefined;

    return {
        ...cat,
        color: cat.color as CatColor,
    };
    }

  async filterByColor(color: CatColor): Promise<Cat[]> {
    const cats = await this.catModel.find({ color }).lean();

    return cats.map(cat => ({
        ...cat,
        color: cat.color as CatColor,
    }));
    }
}