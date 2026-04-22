import { randomUUID } from 'crypto';
import { TaskPriority } from './task-priority.enum';
import { TaskStatus } from './task-status.enum';

export interface TaskProps {
  id: string;
  name: string;
  deadline: Date;
  status: TaskStatus;
  priority: TaskPriority;
}

export class Task {
  private constructor(private readonly props: TaskProps) {}

  static create(params: {
    name: string;
    deadline: Date;
    priority: TaskPriority;
  }): Task {
    const name = params.name.trim();

    if (!name) {
      throw new Error('Task name cannot be empty');
    }

    if (Number.isNaN(params.deadline.getTime())) {
      throw new Error('Task deadline must be a valid date');
    }

    return new Task({
      id: randomUUID(),
      name,
      deadline: params.deadline,
      status: TaskStatus.NEW,
      priority: params.priority,
    });
  }

  static rehydrate(props: TaskProps): Task {
    return new Task(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get deadline(): Date {
    return this.props.deadline;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get priority(): TaskPriority {
    return this.props.priority;
  }

  start(): Task {
    if (this.props.status === TaskStatus.IN_PROGRESS) {
      throw new Error('Task is already in progress');
    }

    if (this.props.status === TaskStatus.DONE) {
      throw new Error('Completed task cannot be restarted');
    }

    return new Task({
      ...this.props,
      status: TaskStatus.IN_PROGRESS,
    });
  }

  isExpired(referenceDate: Date): boolean {
    return this.props.deadline.getTime() < referenceDate.getTime();
  }

  toPrimitives(): TaskProps {
    return {
      ...this.props,
    };
  }
}
