
import { Cat } from './domain/cat.class';
import { CatColor } from './domain/cats.color.enum';
import { CreateCatDto } from './dto/createCat.dto';
import { MessageCat } from './dto/messageCat.dto';

export interface CatsCrud {

  create(catDto: CreateCatDto): Promise<MessageCat>;

  update(id: string, catDto: CreateCatDto): Promise<MessageCat>;

  remove(id: string): Promise<MessageCat>;

  findAll(): Promise<Cat[]>;

  filterByColor(color: CatColor): Promise<Cat[]>;

  findOne(id: string): Promise<Cat | undefined>;
}
