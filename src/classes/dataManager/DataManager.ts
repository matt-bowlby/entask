import { Event,Task } from "@classes/thing/Thing";
import * as fs from 'fs';
import * as path from 'path';

class DataManager {
    private file_name: string = 'database.json';
    private file_path = path.join('src/database', this.file_name);

    public test(): void {
        fs.writeFileSync(this.file_path, "TEST WORKED");
    }

    public saveEvent(eventInstance:Event): void{
        fs.writeFileSync(this.file_path, "Discription: " + eventInstance.name);
    }

    public deleteEvent(): void {

    }

    public loadEvent(): void {

    }

    ///////////////// Tasks /////////////////

    public taskSave(): void{

    }

    public taskDelete(): void {

    }

    public taskLoad(): void {

    }

}

export default DataManager;