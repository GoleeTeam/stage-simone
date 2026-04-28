import { Task } from './task.entity';
import { TaskPriority } from './task-priority.enum';
import { TaskStatus } from './task-status.enum';
import { Tasks } from './tasks.collection';
import { Quantity } from './value-objects/quantity.vo';

export interface WorkerSnapshot {
  id: string;
  tasks: {
    id: string;
    name: string;
    deadline: Date;
    status: TaskStatus;
    priority: TaskPriority;
  }[];
}

export class Worker {
  private constructor(
    public readonly id: string,
    private readonly tasks: Tasks,
  ) {}

  static create(id: string): Worker {
    if (!id.trim()) {
      throw new Error('Worker id cannot be empty');
    }

    return new Worker(id, new Tasks());
  }

  static rehydrate(snapshot: WorkerSnapshot): Worker {
    return new Worker(
      snapshot.id,
      new Tasks(
        snapshot.tasks.map((task) =>
          Task.rehydrate({
            id: task.id,
            name: task.name,
            deadline: new Date(task.deadline),
            status: task.status,
            priority: task.priority,
          }),
        ),
      ),
    );
  }

  newTask(name: string, deadline: Date, priority: TaskPriority): Worker {
    const task = this.tasks.create(name, deadline, priority);

    return new Worker(this.id, this.tasks.add(task));
  }

  startTask(taskId: string): Worker {
    return new Worker(this.id, this.tasks.start(taskId));
  }

  getExpiredTasks(referenceDate: Date): Task[] {
    return this.tasks.getExpired(referenceDate);
  }

  getTodo(): Quantity {
    return Quantity.create(this.tasks.countNew());
  }

  getInProgress(): Quantity {
    return Quantity.create(this.tasks.countInProgress());
  }

  getTasks(): Task[] {
    return this.tasks.toArray();
  }

  toSnapshot(): WorkerSnapshot {
    return {
      id: this.id,
      tasks: this.tasks.toArray().map((task) => task.toPrimitives()),
    };
  }
}
