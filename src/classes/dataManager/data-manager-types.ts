type EventType = {
    name: string,
    completed: boolean,
    description: string,
    startTime: number,
    duration: number,
    id: number
};

type TaskType = {
    name: string,
    completed: boolean,
    description: string,
    startTime: number,
    duration: number,
    id: number
    dueDate: number
};

export type {EventType, TaskType};