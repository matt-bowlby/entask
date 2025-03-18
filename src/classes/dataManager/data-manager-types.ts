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

type TagType = {
    name: string,
    description: string,
    color: string,
    id: number
}

export type {EventType, TaskType, TagType};