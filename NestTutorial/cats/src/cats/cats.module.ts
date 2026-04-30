import { Module } from '@nestjs/common';
import { CATS_SERVICE, CatsController } from './cats.controller';
import { CATS_REPOSITORY, CatsService } from './cats.service';
import { CatsInMemoryRepository } from './repo/catsInMemory.repository';
import { CatsFakeRepository } from './repo/catsFake.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from './schemas/cat.schema';
import { Cat } from './domain/cat.class'

@Module({
  controllers: [CatsController],
  providers: [
    {
      provide: CATS_SERVICE,
      useClass: CatsService,
    },
    {
      provide: CATS_REPOSITORY,
      useClass: CatsFakeRepository,
    },
  ],
  imports: [
    MongooseModule.forFeature([
      { name:Cat.name, schema:CatSchema },
    ]),
  ],
})
export class CatsModule {}
