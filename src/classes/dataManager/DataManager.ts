import { Event, Task } from "@classes/thing/Thing";
import Calendar from '../calendar/Calendar';
import * as fs from 'fs';
import * as path from 'path';
import { EventType, TaskType } from "./data-manager-types";
import { ThingList } from "../thing/ThingList";

class DataManager {
    //event database json
    private event_file_name: string = 'event-database.json';
    private event_file_path = path.join('src/database', this.event_file_name);
    //task database json
    private task_file_name: string = 'task-database.json';
    private task_file_path = path.join('src/database', this.task_file_name);


	///////////////// Load Calender /////////////////
	public loadDatabase(): Calendar { //TODO: read database and load Events and Tasks into calender type.
		const dataCalender = new Calendar("test string");
		return (dataCalender);
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
        
    }

    ///////////////// Tasks /////////////////

	public saveTask(task_instance: Task): void {
    try {
            const json_string = fs.readFileSync(this.event_file_path, 'utf8');

            let events: EventType[];
            try {
                events = JSON.parse(json_string);
            } catch (error) {
                events = [];
            }

            const new_event: EventType = {
                "name": task_instance.name,
                "completed": task_instance.completed,
                "description": task_instance.description,
                "startTime": task_instance.startTime,
                "duration": task_instance.getDuration(),
                "id": task_instance.id
            };

            events.push(new_event);
            const json_data = JSON.stringify(events, null, 2);

            fs.writeFileSync(this.event_file_path, json_data);

        } catch (error) {
            console.error("Error adding event:", error);
        }
    }

	public deleteTask(): void {

    }

	public loadTask(): void {

    }

}

export default DataManager;