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

}

export default TagBlock;