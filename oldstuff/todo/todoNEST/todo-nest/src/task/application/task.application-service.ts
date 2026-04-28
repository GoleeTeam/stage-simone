import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskPriority } from '../domain/task-priority.enum';
import { Worker } from '../domain/worker.aggregate';
import {
  WORKER_REPOSITORY,
} from '../repo/worker.repository';
import type { WorkerRepository } from '../repo/worker.repository';

@Injectable()
export class TaskApplicationService {
  constructor(
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepository: WorkerRepository,
  ) {}

  async newTask(
    workerId: string,
    name: string,
    deadline: string,
    priority: TaskPriority,
  ) {
    try {
      const worker = await this.getOrCreate(workerId);
      const updatedWorker = worker.newTask(name, new Date(deadline), priority);
      const createdTask = updatedWorker.getTasks().at(-1);

      await this.workerRepository.save(updatedWorker);

      return {
        workerId: updatedWorker.id,
        taskId: createdTask?.id,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to create task';

      throw new BadRequestException(message);
    }
  }

  async startTask(workerId: string, taskId: string) {
    const worker = await this.workerRepository.findById(workerId);

    if (!worker) {
      throw new NotFoundException(`Worker ${workerId} not found`);
    }

    try {
      const updatedWorker = worker.startTask(taskId);
      await this.workerRepository.save(updatedWorker);

      return {
        workerId: updatedWorker.id,
        taskId,
        status: 'IN_PROGRESS',
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to start task';

      throw new BadRequestException(message);
    }
  }

  async getWorkerState(workerId: string) {
    const worker = await this.workerRepository.findById(workerId);

    if (!worker) {
      throw new NotFoundException(`Worker ${workerId} not found`);
    }

    return {
      workerId: worker.id,
      todo: worker.getTodo().toNumber(),
      inProgress: worker.getInProgress().toNumber(),
      tasks: worker.getTasks().map((task) => task.toPrimitives()),
    };
  }

  async getExpiredTasks(workerId: string) {
    const worker = await this.workerRepository.findById(workerId);

    if (!worker) {
      throw new NotFoundException(`Worker ${workerId} not found`);
    }

    return worker
      .getExpiredTasks(new Date())
      .map((task) => task.toPrimitives());
  }

  private async getOrCreate(workerId: string): Promise<Worker> {
    const existingWorker = await this.workerRepository.findById(workerId);

    return existingWorker ?? Worker.create(workerId);
  }
}
