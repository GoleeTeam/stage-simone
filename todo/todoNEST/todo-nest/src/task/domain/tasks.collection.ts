import { Task } from './task.entity';
import { TaskPriority } from './task-priority.enum';
import { TaskStatus } from './task-status.enum';

export class Tasks {
  constructor(private readonly items: Task[] = []) {}

  create(name: string, deadline: Date, priority: TaskPriority): Task {
    return Task.create({ name, deadline, priority });
  }

  add(task: Task): Tasks {
    return new Tasks([...this.items, task]);
  }

  start(taskId: string): Tasks {
    const task = this.items.find((item) => item.id === taskId);

    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    return new Tasks(
      this.items.map((item) => (item.id === taskId ? item.start() : item)),
    );
  }

  getExpired(referenceDate: Date): Task[] {
    return this.items.filter((item) => item.isExpired(referenceDate));
  }

  countNew(): number {
    return this.items.filter((item) => item.status === TaskStatus.NEW).length;
  }

  countInProgress(): number {
    return this.items.filter((item) => item.status === TaskStatus.IN_PROGRESS)
      .length;
  }

  toArray(): Task[] {
    return [...this.items];
  }
}
