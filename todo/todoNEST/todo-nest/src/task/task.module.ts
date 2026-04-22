import { Module } from '@nestjs/common';
import { TaskApplicationService } from './application/task.application-service';
import { InMemoryWorkerRepository } from './infrastructure/in-memory-worker.repository';
import { WORKER_REPOSITORY } from './repo/worker.repository';
import { TaskController } from './task.controller';

@Module({
  controllers: [TaskController],
  providers: [
    TaskApplicationService,
    {
      provide: WORKER_REPOSITORY,
      useClass: InMemoryWorkerRepository,
    },
  ],
})
export class TaskModule {}
