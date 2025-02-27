import { Event,Task } from "@classes/thing/Thing";
import * as fs from 'fs';
import * as path from 'path';

class DataManager {
    private filename: string = 'database.json';
    private filepath = path.join('src/database', this.filename);

    public test(): void {
        fs.writeFileSync(this.filepath, "TEST WORKED");
    }
}

export default DataManager;