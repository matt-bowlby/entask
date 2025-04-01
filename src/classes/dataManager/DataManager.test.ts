import Tag from "../tag/Tag";
//import { Event, Task } from "../thing/Thing";
//import Thing from "../thing/Thing";
import DataManager from "./DataManager";

describe('DataManager', () =>  {
    let myDataManager: DataManager;
    let myTag: Tag;
    let myTags: Array<Tag>;

    beforeEach(() => {
        myDataManager = new DataManager;
        myTag = new Tag("pizza time", "itssa pizza time");
        myTags = [];
        myTags.push(myTag);
    })

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

    test('LoadTag', () => {
        let tags: Array<Tag> = [];
        myDataManager.loadTags(tags);

        console.log(tags[0].getName());
    })
});
