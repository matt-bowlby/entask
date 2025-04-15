import Tag  from './Tag';
import Thing from '../thing/Thing';

class TagBlock extends Thing {

    constructor(
        duration: number = 0,
        startTime: number = 0,
        description: string = "",
        tags: Array<Tag> = [],
        completed: boolean = false,
        customId: number = -1
    ) {
        let tagName = "";
        for (const tag of tags) {
            tagName += tag.getName() + ", ";
        }
        super(tagName.trim(), duration, startTime, description, tags, completed, customId);
    }

    public duplicate(): TagBlock {
        return new TagBlock(
            this.duration,
            this.startTime,
            this.description,
            [...this.tags],
            this.completed,
            this.id
        );
    }

    public toJson(): object {
        return {
            type: "TagBlock",
            name: this.name,
            duration: this.duration,
            startTime: this.startTime,
            description: this.description,
            tags: this.tags.map(tag => tag.toJson()),
            completed: this.completed,
            id: this.id
        };
    }

    public static fromJson(json: any): TagBlock {
        return new TagBlock(
            json.duration,
            json.startTime,
            json.description,
            json.tags.map((tag: any) => Tag.fromJson(tag)),
            json.completed,
            json.id
        );
    }

}

export default TagBlock;