import { Task, Event } from "../thing/Thing";
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
    // })

    // test('LoadTask', () => {
    //     // const myTask = new Task("myTask", undefined, undefined, undefined, undefined, myTags);
    //     // myDataManager.saveTask(myTask);
    //     let thing_list: Array<Thing> = [];
    //     myDataManager.loadActiveEvents(thing_list);
    // })

    // test('LoadDatabase', () => {
    //     let calendar: Calendar = DataManager.loadDatabase("newCal");
    // })

    test('savestuff', () => {
        const myTask = new Task("myTask", 2 * 1000 * 60 * 60, Date.now());
        const myEvent = new Event("myEvent", 2 * 1000 * 60 * 60, Date.now());
        DataManager.saveTask(myTask);
        DataManager.saveEvent(myEvent);
    })
});
