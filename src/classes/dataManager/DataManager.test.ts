import { Task } from "../thing/Thing";
//import Thing from "../thing/Thing";
import DataManager from "./DataManager";
//import Calendar from "../calendar/Calendar";
//import Thing from "../thing/Thing";

describe('DataManager', () =>  {

    // test('SaveTags', () => {
    //     myDataManager.saveTags(myTags);
    // })

    // test('LoadEvent', () => {
    //     // const myEvent = new Event("myEvent", undefined, undefined, undefined, myTags);
    //     // myDataManager.saveEvent(myEvent);
    //     let thing_list: Array<Thing> = [];
    //     myDataManager.loadActiveEvents(thing_list);
    //     console.log(thing_list[0].getTags()[0].getName());
    // })

    // test('LoadTask', () => {
    //     // const myTask = new Task("myTask", undefined, undefined, undefined, undefined, myTags);
    //     // myDataManager.saveTask(myTask);
    //     let thing_list: Array<Thing> = [];
    //     myDataManager.loadActiveEvents(thing_list);
    //     console.log(thing_list[0].getTags()[0].getName());
    // })

    // test('LoadDatabase', () => {
    //     let calendar: Calendar = DataManager.loadDatabase("newCal");
    //     console.log(calendar.getName());
    // })

    test('savestuff', () => {
        const myTask = new Task("myTask", 2 * 1000 * 60 * 60, Date.now());
        DataManager.saveTask(myTask);
    })
});
