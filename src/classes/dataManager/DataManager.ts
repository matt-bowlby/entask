import { Event, Task } from "../thing/Thing";
import Calendar from '../calendar/Calendar';
import * as fs from 'fs';
import * as path from 'path';
import { EventType, TaskType } from "./data-manager-types";
import { ThingList } from "../thing/ThingList";

class DataManager {
    //File paths & names
    private event_comp_file_name: string = 'event-completed-database.json';
    private event_comp_file_path = path.join('src/database', this.event_comp_file_name);
    private task_comp_file_name: string = 'task-completed-database.json';
    private task_comp_file_path = path.join('src/database', this.task_comp_file_name);
    private event_act_file_name: string = 'event-active-database.json';
    private event_act_file_path = path.join('src/database', this.event_act_file_name);
    private task_act_file_name: string = 'task-active-database.json';
    private task_act_file_path = path.join('src/database', this.task_act_file_name);
    private ids_name: string = 'ids.json';
    private ids_file_path = path.join('src/database', this.ids_name);


	///////////////// Load Calender /////////////////
	public loadDatabase(calendar_name: string): Calendar { //TODO: read database and load Events and Tasks into calender type.
        let comp_thing_list = new ThingList;
        let act_thing_list = new ThingList;
        this.loadCompletedEvents(comp_thing_list);
        this.loadCompletedTasks(comp_thing_list);
        this.loadActiveEvents(act_thing_list);
        this.loadActiveTasks(act_thing_list);
		const dataCalendar = new Calendar(calendar_name, act_thing_list, comp_thing_list);
		return (dataCalendar);
	}

	///////////////// Events /////////////////
    public saveEvent(event_instance:Event): void{
        try {
            let file_path;
            if (event_instance.completed) {
                file_path = this.event_comp_file_path;
            }
            else {
                file_path = this.event_act_file_path;
            }

            const json_string = fs.readFileSync(file_path, 'utf8');
            
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

            fs.writeFileSync(file_path, json_data);

        } catch (error) {
            console.error("Error adding event:", error);
        }
    }

    public deleteEvent(event_instance:Event): void {
        try {
            let file_path;
            if (event_instance.completed) {
                file_path = this.event_comp_file_path;
            }
            else {
                file_path = this.event_act_file_path;
            }
            const json_string = fs.readFileSync(file_path, 'utf8');
            const events: EventType[] = JSON.parse(json_string);

            const new_events = events.filter(event => event.id !== event_instance.id);

            const json_data = JSON.stringify(new_events, null, 2);
            fs.writeFileSync(file_path, json_data);
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    }

    public loadActiveEvents(thing_list: ThingList): void {
        try {
            const json_string = fs.readFileSync(this.event_act_file_path, 'utf8');
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
        catch (error) {
            console.error("Error loading events:", error);
        }
    }

    public loadCompletedEvents(thing_list: ThingList): void {
        try {
            const json_string = fs.readFileSync(this.event_comp_file_path, 'utf8');
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
        catch (error) {
            console.error("Error loading events:", error);
        }
    }

    ///////////////// Tasks /////////////////

    public saveTask(task_instance: Task): void {
        try {
            let file_path;
            if (task_instance.completed) {
                file_path = this.task_comp_file_path;
            }
            else {
                file_path = this.task_act_file_path;
            }

            const json_string = fs.readFileSync(file_path, 'utf8');

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

            fs.writeFileSync(file_path, json_data);

        } catch (error) {
            console.error("Error adding task:", error);
        }
    }

    public deleteTask(task_instance:Task): void {
        try {
            let file_path;
            if (task_instance.completed) {
                file_path = this.task_comp_file_path;
            }
            else {
                file_path = this.task_act_file_path;
            }
            const json_string = fs.readFileSync(file_path, 'utf8');
            const tasks: TaskType[] = JSON.parse(json_string);

            const new_tasks = tasks.filter(task => task.id !== task_instance.id);

            const json_data = JSON.stringify(new_tasks, null, 2);
            fs.writeFileSync(file_path, json_data);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    public loadActiveTasks(thing_list: ThingList): void {
        try {
            const json_string = fs.readFileSync(this.task_act_file_path, 'utf8');
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
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    }

    public loadCompletedTasks(thing_list: ThingList): void {
        try {
            const json_string = fs.readFileSync(this.task_comp_file_path, 'utf8');
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
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    }

    ///////////////// ID's /////////////////

    public saveIds(ids: Array<number>) {
        try {
            const json_data = JSON.stringify(ids);
            fs.writeFileSync(this.ids_file_path, json_data);
        } catch (error) {
            console.error("Error saving ids:", error);
        }
    }

    public loadIds(): Array<number> {
        try {
            const json_string = fs.readFileSync(this.ids_file_path, 'utf8');
            let ids: Array<number>;

            try {
                ids = JSON.parse(json_string);
            } catch (error) {
                ids = [];
            }

            return ids;
        } catch (error) {
            console.error("Error saving ids:", error);
        }
        return [];
    }
}

export default DataManager;