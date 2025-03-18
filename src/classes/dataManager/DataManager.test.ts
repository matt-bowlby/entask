import Tag from "../tag/Tag";
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

    test('SaveTags', () => {
        myDataManager.saveTags(myTags);
    })
});
