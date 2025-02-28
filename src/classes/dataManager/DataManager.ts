import { Event, Task } from "@classes/thing/Thing";
import Calendar from '../calendar/Calendar';
import * as fs from 'fs';
import { endianness } from 'os';
import * as path from 'path';

type EventType = {
    summary: string,
    start: {
        date: Date
    },
    end: {
        date: Date
    }
};

class DataManager {
    private file_name: string = 'database.json';
    private file_path = path.join('src/database', this.file_name);

    public test(): void {
        fs.writeFileSync(this.file_path, "TEST WORKED");
    }


	///////////////// Calender /////////////////
	public getDatabase(): Calendar { //TODO: read database and load Events and Tasks into calender type.
		const dataCalender = new Calendar("test string");
		return (dataCalender);
	}

	///////////////// Events /////////////////
    public saveEvent(eventInstance:Event): void{
        const json_string = fs.readFileSync(this.file_path, 'utf8');

        let events: EventType[];
        try {
            events = JSON.parse(json_string);
        } catch (error) {
            events = [];
        }

        const start_date = new Date(eventInstance.startTime);
        const end_date = new Date(eventInstance.startTime + eventInstance.duration);
        const new_event: EventType = {
            "summary": eventInstance.name,
            "start": {
                "date": start_date
            },
            "end": {
                "date": end_date
            }
        }

        if (!events.some(event => event.summary === new_event.summary)) {
            events.push(new_event);
            const json_data = JSON.stringify(events, null, 2);

            fs.writeFileSync(this.file_path, json_data);
        }
        else {
            console.log("Event already exists...");
        }
    }

    public deleteEvent(event_name:string): void {
        const json_string = fs.readFileSync(this.file_path, 'utf8');
        const events: EventType[] = JSON.parse(json_string);

        const new_events = events.filter(event => event.summary !== event_name);

        const json_data = JSON.stringify(new_events, null, 2);
        fs.writeFileSync(this.file_path, json_data);
    }

    public loadEvent(): void {

    }

    ///////////////// Tasks /////////////////

	public saveTask(eventInstance: Task): void {

    }

	public deleteTask(): void {

    }

	public loadTask(): void {

    }

}

export default DataManager;