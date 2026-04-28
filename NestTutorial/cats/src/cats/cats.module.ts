import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CatsInMemoryRepository } from './repo/catsInMemory.repository';

@Module({
  controllers: [CatsController],
  providers: [CatsService, CatsInMemoryRepository],
})
export class CatsModule {}
