import { Event, Task } from "@classes/thing/Thing";
import * as fs from 'fs';
import * as path from 'path';

class DataManager {
    private file_name: string = 'database.json';
    private file_path = path.join('src/database', this.file_name);

    public test(): void {
        fs.writeFileSync(this.file_path, "TEST WORKED");
    }

    public saveEvent(eventInstance:Event): void{
        const start_date = new Date(eventInstance.startTime);
        const end_date = new Date(eventInstance.startTime + eventInstance.duration);
        const event = {
            "summary": eventInstance.name,
            "start": {
                "date": start_date
            },
            "end": {
                "date": end_date
            }
        }

        const json_data = JSON.stringify(event, null, 2);

        fs.writeFileSync(this.file_path, json_data);
    }

    public deleteEvent(): void {

    }

    public loadEvent(): void {

    }

    ///////////////// Tasks /////////////////

    public taskSave(eventInstance:Task): void{

    }

    public taskDelete(): void {

    }

    public taskLoad(): void {

    }

}

export default DataManager;