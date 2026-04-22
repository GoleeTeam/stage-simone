import { Worker } from '../domain/worker.aggregate';

export const WORKER_REPOSITORY = Symbol('WORKER_REPOSITORY');

export interface WorkerRepository {
  findById(workerId: string): Promise<Worker | null>;
  save(worker: Worker): Promise<void>;
}
