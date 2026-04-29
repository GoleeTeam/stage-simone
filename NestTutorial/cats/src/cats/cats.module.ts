import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CATS_REPOSITORY, CatsService } from './cats.service';
import { CatsInMemoryRepository } from './repo/catsInMemory.repository';

@Module({
  controllers: [CatsController],
  providers: [
    CatsService,
    {
      provide: CATS_REPOSITORY,
      useClass: CatsInMemoryRepository,
    },
  ],
})
export class CatsModule {}
