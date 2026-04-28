import { Injectable } from '@nestjs/common';
import { Worker } from '../domain/worker.aggregate';
import { WorkerRepository } from '../repo/worker.repository';
import { WorkerSerializer, WorkerTaskModel } from '../repo/worker.serializer';

@Injectable()
export class InMemoryWorkerRepository implements WorkerRepository {
  private readonly storage = new Map<string, WorkerTaskModel>();
  private readonly serializer = new WorkerSerializer();

  async findById(workerId: string): Promise<Worker | null> {
    const model = this.storage.get(workerId);

    if (!model) {
      return null;
    }

    return this.serializer.modelToAggregate(model);
  }

  async save(worker: Worker): Promise<void> {
    this.storage.set(worker.id, this.serializer.aggregateToModel(worker));
  }
}
