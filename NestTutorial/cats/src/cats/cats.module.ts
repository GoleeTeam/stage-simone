import { Module } from '@nestjs/common';
import { CATS_SERVICE, CatsController } from './adapters/cats.controller';
import { CATS_REPOSITORY, CatsService } from './application/cats.service';
import { CatsInMemoryRepository } from './infrastructure/repo/catsInMemory.repository';
import { CatsFakeRepository } from './infrastructure/repo/catsFake.repository';
import { CatsMongoRepository } from './infrastructure/repo/catsMongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from './infrastructure/schemas/cat.schema';
import { Cat } from './domain/cat.class'
import { GattiController } from './adapters/gatti.controller';

@Module({
  controllers: [CatsController, GattiController],
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
