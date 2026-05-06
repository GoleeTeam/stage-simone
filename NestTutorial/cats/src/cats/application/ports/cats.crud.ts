
import { Cat } from '../../domain/cat.class';
import { CatColor } from '../../domain/cats.color.enum';
import { CreateCatInput } from '../input/createCatInput';
import { MessageCat } from '../../adapters/dto/messageCat.dto';

export interface CatsCrud {

  create(input: CreateCatInput): Promise<MessageCat>;

  update(id: string, input: CreateCatInput): Promise<MessageCat>;

  remove(id: string): Promise<MessageCat>;

  findAll(): Promise<Cat[]>;

  filterByColor(color: CatColor): Promise<Cat[]>;

  findOne(id: string): Promise<Cat | undefined>;
}
