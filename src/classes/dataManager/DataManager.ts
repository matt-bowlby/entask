import { Event, Task } from "../thing/Thing";
import Calendar from '../calendar/Calendar';
import * as fs from 'fs';
import * as path from 'path';
import { EventType, TaskType } from "./data-manager-types";
import { ThingList } from "../thing/ThingList";

class DataManager {
    //File paths & names
    private event_file_name: string = 'event-database.json';
    private event_file_path = path.join('src/database', this.event_file_name);
    private task_file_name: string = 'task-database.json';
    private task_file_path = path.join('src/database', this.task_file_name);


	///////////////// Load Calender /////////////////
	public loadDatabase(calendar_name: string): Calendar { //TODO: read database and load Events and Tasks into calender type.
        let thing_list = new ThingList;
        this.loadEvents(thing_list);
        this.loadTasks(thing_list);
		const dataCalendar = new Calendar(calendar_name, thing_list);
		return (dataCalendar);
	}

	///////////////// Events /////////////////
    public saveEvent(event_instance:Event): void{
        try {
            const json_string = fs.readFileSync(this.event_file_path, 'utf8');

            let events: EventType[];
            try {
                events = JSON.parse(json_string);
            } catch (error) {
                events = [];
            }

            const new_event: EventType = {
                "name": event_instance.name,
                "completed": event_instance.completed,
                "description": event_instance.description,
                "startTime": event_instance.startTime,
                "duration": event_instance.getDuration(),
                "id": event_instance.id
            };

            events.push(new_event);
            const json_data = JSON.stringify(events, null, 2);

            fs.writeFileSync(this.event_file_path, json_data);

        } catch (error) {
            console.error("Error adding event:", error);
        }
    }

    public deleteEvent(event_instance:Event): void {
        try {
            const json_string = fs.readFileSync(this.event_file_path, 'utf8');
            const events: EventType[] = JSON.parse(json_string);

            const new_events = events.filter(event => event.id !== event_instance.id);

            const json_data = JSON.stringify(new_events, null, 2);
            fs.writeFileSync(this.event_file_path, json_data);
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    }

    public loadEvents(thing_list: ThingList): void {
        const json_string = fs.readFileSync(this.event_file_path, 'utf8');
        const event_objs: EventType[] = JSON.parse(json_string);

        for (let i = 0; i < event_objs.length; i++) {
            let loaded_event = new Event(
                event_objs[i].name, 
                event_objs[i].duration,
                event_objs[i].completed,
                event_objs[i].description,
                event_objs[i].startTime,
                event_objs[i].id
            );
            thing_list.addThing(loaded_event);
        }
    }

    ///////////////// Tasks /////////////////

    public saveTask(task_instance: Task): void {
    try {
            const json_string = fs.readFileSync(this.task_file_path, 'utf8');

            let tasks: TaskType[];
            try {
                tasks = JSON.parse(json_string);
            } catch (error) {
                tasks = [];
            }

            const new_task: TaskType = {
                "name": task_instance.name,
                "completed": task_instance.completed,
                "description": task_instance.description,
                "startTime": task_instance.startTime,
                "duration": task_instance.getDuration(),
                "id": task_instance.id,
                "dueDate": task_instance.dueDate,
            };

            tasks.push(new_task);
            const json_data = JSON.stringify(tasks, null, 2);

            fs.writeFileSync(this.task_file_path, json_data);

        } catch (error) {
            console.error("Error adding task:", error);
        }
    }

    public deleteTask(task_instance:Task): void {
        try {
            const json_string = fs.readFileSync(this.event_file_path, 'utf8');
            const tasks: TaskType[] = JSON.parse(json_string);

            const new_tasks = tasks.filter(task => task.id !== task_instance.id);

            const json_data = JSON.stringify(new_tasks, null, 2);
            fs.writeFileSync(this.task_file_path, json_data);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    public loadTasks(thing_list: ThingList): void {
        const json_string = fs.readFileSync(this.task_file_path, 'utf8');
        const task_objs: TaskType[] = JSON.parse(json_string);

        for (let i = 0; i < task_objs.length; i++) {
            let loaded_task = new Task(
                task_objs[i].name, 
                task_objs[i].duration,
                task_objs[i].dueDate,
                task_objs[i].completed,
                task_objs[i].description,
                task_objs[i].startTime,
                task_objs[i].id,
            );
            thing_list.addThing(loaded_task);
        }
    }

}

export default DataManager;