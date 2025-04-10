import Thing, { Event, Task } from "../thing/Thing";
import Calendar from '../calendar/Calendar';
import * as fs from 'fs';
import * as path from 'path';
import { EventType, TaskType, TagType } from "./data-manager-types";
import Tag from "../tag/Tag";
import IdHandler from "../calendar/IdHandler";

class DataManager {
    //File paths & names
    private static event_comp_file_name: string = 'event-completed-database.json';
    private static event_comp_file_path = path.join('src/database', this.event_comp_file_name);
    private static task_comp_file_name: string = 'task-completed-database.json';
    private static task_comp_file_path = path.join('src/database', this.task_comp_file_name);
    private static event_act_file_name: string = 'event-active-database.json';
    private static event_act_file_path = path.join('src/database', this.event_act_file_name);
    private static task_act_file_name: string = 'task-active-database.json';
    private static task_act_file_path = path.join('src/database', this.task_act_file_name);
    private static tags_name: string = 'tags.json';
    private static tags_file_path = path.join('src/database', this.tags_name);


	///////////////// Load Calender /////////////////
	public static loadDatabase(calendar_name: string): Calendar { //TODO: read database and load Events and Tasks into calender type.
        let comp_thing_list: Array<Thing> = [];
        let act_thing_list: Array<Thing> = [];
        let tag_list: Array<Tag> = [];

        this.loadTags(tag_list);
        this.loadCompletedEvents(comp_thing_list);
        this.loadCompletedTasks(comp_thing_list);
        this.loadActiveEvents(act_thing_list);
        this.loadActiveTasks(act_thing_list);
		const dataCalendar = new Calendar(calendar_name, act_thing_list, comp_thing_list, undefined, tag_list);
		return (dataCalendar);
	}

    public static saveDatabaseOverwrite(calendar_instance: Calendar) {
        this.clearDatabase();

        const tag_list = calendar_instance.getTags();
        const act_thing_list = calendar_instance.getActiveThings();
        const comp_thing_list = calendar_instance.getCompletedThings();

        this.saveTags(tag_list);

        for (let i = 0; i < act_thing_list.length; i++) {
            if (act_thing_list[i] instanceof Event) {
                this.saveEvent(act_thing_list[i] as Event);
            }
            else if (act_thing_list[i] instanceof Task) {
                this.saveTask(act_thing_list[i] as Task);
            }
        }

        for (let i = 0; i < comp_thing_list.length; i++) {
            if (comp_thing_list[i] instanceof Event) {
                this.saveEvent(comp_thing_list[i] as Event);
            }
            else if (comp_thing_list[i] instanceof Task) {
                this.saveTask(comp_thing_list[i] as Task);
            }
        }
    }

    public static clearDatabase() {
        if (fs.existsSync(this.event_act_file_path)) {
            fs.writeFileSync(this.event_act_file_path, '[]')
        }
        if (fs.existsSync(this.event_comp_file_path)) {
            fs.writeFileSync(this.event_comp_file_path, '[]')
        }
        if (fs.existsSync(this.task_act_file_path)) {
            fs.writeFileSync(this.task_act_file_path, '[]')
        }
        if (fs.existsSync(this.task_comp_file_path)) {
            fs.writeFileSync(this.task_comp_file_path, '[]')
        }
        if (fs.existsSync(this.tags_file_path)) {
            fs.writeFileSync(this.tags_file_path, '[]')
        }
    }

	///////////////// Events /////////////////
    public static saveEvent(event_instance:Event): void{
        try {
            let file_path;
            if (event_instance.isCompleted()) {
                file_path = this.event_comp_file_path;
            }
            else {
                file_path = this.event_act_file_path;
            }

            if (!fs.existsSync(file_path)) {
                fs.writeFileSync(file_path, '[]')
            }

            const json_string = fs.readFileSync(file_path, 'utf8');

            let events: EventType[];
            try {
                events = JSON.parse(json_string);
            } catch (error) {
                events = [];
            }

            const new_event: EventType = {
                "name": event_instance.getName(),
                "completed": event_instance.isCompleted(),
                "description": event_instance.getDescription(),
                "startTime": event_instance.getStartTime(),
                "duration": event_instance.getDuration(),
                "tags": event_instance.getTags().map((tag) => {return tag.id}),
                "id": event_instance.id,
            };

            events.push(new_event);
            const json_data = JSON.stringify(events, null, 2);

            fs.writeFileSync(file_path, json_data);

        } catch (error) {
            console.error("Error adding event:", error);
        }
    }

    public static deleteEvent(event_instance:Event): void {
        try {
            let file_path;
            if (event_instance.isCompleted()) {
                file_path = this.event_comp_file_path;
            }
            else {
                file_path = this.event_act_file_path;
            }

            if (!fs.existsSync(file_path)) {
                fs.writeFileSync(file_path, '[]')
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

    public static loadActiveEvents(thing_list: Array<Thing>): void {
        try {
            if (!fs.existsSync(this.event_act_file_path)) {
                fs.writeFileSync(this.event_act_file_path, '[]')
            }

            const json_string = fs.readFileSync(this.event_act_file_path, 'utf8');
            const event_objs: EventType[] = JSON.parse(json_string);

            for (let i = 0; i < event_objs.length; i++) {
                let loaded_event = new Event(
                    event_objs[i].name,
                    event_objs[i].duration,
                    event_objs[i].startTime,
                    event_objs[i].description,
                    event_objs[i].tags.map((tagId) => {return IdHandler.getInstance(tagId) as Tag}),
                    event_objs[i].completed,
                    event_objs[i].id
                );
                thing_list.push(loaded_event);
            }
        }
        catch (error) {
            console.error("Error loading events:", error);
        }
    }

    public static loadCompletedEvents(thing_list: Array<Thing>): void {
        try {
            if (!fs.existsSync(this.event_comp_file_path)) {
                fs.writeFileSync(this.event_comp_file_path, '[]')
            }

            const json_string = fs.readFileSync(this.event_comp_file_path, 'utf8');
            const event_objs: EventType[] = JSON.parse(json_string);

            for (let i = 0; i < event_objs.length; i++) {
                let loaded_event = new Event(
                    event_objs[i].name,
                    event_objs[i].duration,
                    event_objs[i].startTime,
                    event_objs[i].description,
                    event_objs[i].tags.map((tagIdValue) => {return IdHandler.getInstance(tagIdValue) as Tag}),
                    event_objs[i].completed,
                    event_objs[i].id
                );
                thing_list.push(loaded_event);
            }
        }
        catch (error) {
            console.error("Error loading events:", error);
        }
    }

    ///////////////// Tasks /////////////////

    public static saveTask(task_instance: Task): void {
        try {
            let file_path;
            if (task_instance.isCompleted()) {
                file_path = this.task_comp_file_path;
            }
            else {
                file_path = this.task_act_file_path;
            }

            if (!fs.existsSync(file_path)) {
                fs.writeFileSync(file_path, '[]')
            }

            const json_string = fs.readFileSync(file_path, 'utf8');

            let tasks: TaskType[];
            try {
                tasks = JSON.parse(json_string);
            } catch (error) {
                tasks = [];
            }

            const new_task: TaskType = {
                "name": task_instance.getName(),
                "completed": task_instance.isCompleted(),
                "description": task_instance.getDescription(),
                "startTime": task_instance.getStartTime(),
                "duration": task_instance.getDuration(),
                "tags": task_instance.getTags().map((tag) => {return tag.id}),
                "id": task_instance.id,
                "dueDate": task_instance.getDueDate(),
            };

            tasks.push(new_task);
            const json_data = JSON.stringify(tasks, null, 2);

            fs.writeFileSync(file_path, json_data);

        } catch (error) {
            console.error("Error adding task:", error);
        }
    }

    public static deleteTask(task_instance:Task): void {
        try {
            let file_path;
            if (task_instance.isCompleted()) {
                file_path = this.task_comp_file_path;
            }
            else {
                file_path = this.task_act_file_path;
            }

            if (!fs.existsSync(file_path)) {
                fs.writeFileSync(file_path, '[]')
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

    public static loadActiveTasks(thing_list: Array<Thing>): void {
        try {
            if (!fs.existsSync(this.task_act_file_path)) {
                fs.writeFileSync(this.task_act_file_path, '[]')
            }
            const json_string = fs.readFileSync(this.task_act_file_path, 'utf8');
            const task_objs: TaskType[] = JSON.parse(json_string);

            for (let i = 0; i < task_objs.length; i++) {
                let loaded_task = new Task(
                    task_objs[i].name,
                    task_objs[i].duration,
                    task_objs[i].dueDate,
                    task_objs[i].startTime,
                    task_objs[i].description,
                    task_objs[i].tags.map((tagIdValue) => {return IdHandler.getInstance(tagIdValue) as Tag}),
                    task_objs[i].completed,
                    task_objs[i].id,
                );
                thing_list.push(loaded_task);
            }
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    }

    public static loadCompletedTasks(thing_list: Array<Thing>): void {
        try {
            if (!fs.existsSync(this.task_comp_file_path)) {
                fs.writeFileSync(this.task_comp_file_path, '[]')
            }
            const json_string = fs.readFileSync(this.task_comp_file_path, 'utf8');
            const task_objs: TaskType[] = JSON.parse(json_string);

            for (let i = 0; i < task_objs.length; i++) {
                let loaded_task = new Task(
                    task_objs[i].name,
                    task_objs[i].duration,
                    task_objs[i].dueDate,
                    task_objs[i].startTime,
                    task_objs[i].description,
                    task_objs[i].tags.map((tagIdValue) => {return IdHandler.getInstance(tagIdValue) as Tag}),
                    task_objs[i].completed,
                    task_objs[i].id,
                );
                thing_list.push(loaded_task);
            }
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    }

    ///////////////// ID's /////////////////

    // public saveIds(ids: Array<number>) {
    //     try {
    //         const json_data = JSON.stringify(ids);
    //         fs.writeFileSync(this.ids_file_path, json_data);
    //     } catch (error) {
    //         console.error("Error saving ids:", error);
    //     }
    // }

    // public loadIds(): Array<number> {
    //     try {
    //         const json_string = fs.readFileSync(this.ids_file_path, 'utf8');
    //         let ids: Array<number>;

    //         try {
    //             ids = JSON.parse(json_string);
    //         } catch (error) {
    //             ids = [];
    //         }

    //         return ids;
    //     } catch (error) {
    //         console.error("Error saving ids:", error);
    //     }
    //     return [];
    // }

    ///////////////// Tags /////////////////

    public static saveTags(tags: Array<Tag>) {
        try {
            let tag_objs: TagType[] = [];

            for (let i = 0; i < tags.length; i++) {
                const new_tag: TagType = {
                    "name": tags[i].getName(),
                    "description": tags[i].getDescription(),
                    "color": tags[i].getColor(),
                    "id": tags[i].id,
                };

                tag_objs.push(new_tag);
            }

            const json_data = JSON.stringify(tag_objs, null, 2);

            fs.writeFileSync(this.tags_file_path, json_data);

        } catch (error) {
            console.error("Error adding tags:", error);
        }
    }

    public static loadTags(tags:Array<Tag>) {
        try {
            if (!fs.existsSync(this.tags_file_path)) {
                fs.writeFileSync(this.tags_file_path, '[]')
            }
            const json_string = fs.readFileSync(this.tags_file_path, 'utf8');
            const tags_objs: TagType[] = JSON.parse(json_string);

            for (let i = 0; i < tags_objs.length; i++) {
                let loaded_tag = new Tag(
                    tags_objs[i].name,
                    tags_objs[i].description,
                    tags_objs[i].color,
                    tags_objs[i].id,
                );

                tags.push(loaded_tag);
            }
        } catch (error) {
            console.error("Error loading tags:", error);
        }
    }

    ///////////////// TagBlocks /////////////////


}

export default DataManager;