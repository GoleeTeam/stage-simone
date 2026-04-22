import { TaskPriority } from '../domain/task-priority.enum';
import { TaskStatus } from '../domain/task-status.enum';
import { Worker, WorkerSnapshot } from '../domain/worker.aggregate';

export interface WorkerTaskModel {
  id: string;
  tasks: {
    id: string;
    name: string;
    deadline: string;
    status: TaskStatus;
    priority: TaskPriority;
  }[];
}

export class WorkerSerializer {
  modelToAggregate(model: WorkerTaskModel): Worker {
    const snapshot: WorkerSnapshot = {
      id: model.id,
      tasks: model.tasks.map((task) => ({
        id: task.id,
        name: task.name,
        deadline: new Date(task.deadline),
        status: task.status,
        priority: task.priority,
      })),
    };

    return Worker.rehydrate(snapshot);
  }

  aggregateToModel(worker: Worker): WorkerTaskModel {
    const snapshot = worker.toSnapshot();

    return {
      id: snapshot.id,
      tasks: snapshot.tasks.map((task) => ({
        id: task.id,
        name: task.name,
        deadline: task.deadline.toISOString(),
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
      })),
    };
  }
}
