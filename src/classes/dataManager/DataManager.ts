import { Event, Task } from "@classes/thing/Thing";
import Calendar from '../calendar/Calendar';
import * as fs from 'fs';
import * as path from 'path';

type EventType = {
    id: number,
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
    public saveEvent(event_instance:Event): void{
        try {
            const json_string = fs.readFileSync(this.file_path, 'utf8');

            let events: EventType[];
            try {
                events = JSON.parse(json_string);
            } catch (error) {
                events = [];
            }

            const start_date = new Date(event_instance.startTime);
            const end_date = new Date(event_instance.startTime + event_instance.duration);
            const new_event: EventType = {
                "id": event_instance.id,
                "summary": event_instance.name,
                "start": {
                    "date": start_date
                },
                "end": {
                    "date": end_date
                }
            }

            events.push(new_event);
            const json_data = JSON.stringify(events, null, 2);

            fs.writeFileSync(this.file_path, json_data);

        } catch (error) {
            console.error("Error adding event:", error);
        }
    }

    public deleteEvent(event_instance:Event): void {
        try {
            const json_string = fs.readFileSync(this.file_path, 'utf8');
            const events: EventType[] = JSON.parse(json_string);

            const new_events = events.filter(event => event.id !== event_instance.id);

            const json_data = JSON.stringify(new_events, null, 2);
            fs.writeFileSync(this.file_path, json_data);
        } catch (error) {
            console.error("Error deleting event:", error);
        }
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