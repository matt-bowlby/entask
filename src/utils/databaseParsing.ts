import Thing, {Task, Event} from "../classes/thing/Thing";

function parseThingsFromStupid(dumbArray: object[]): Thing[] {
	const things: Thing[] = dumbArray.map((thing: any) => {
		if (thing.hasOwnProperty("dueDate")) {
			return new Task(
				thing.name,
				thing.duration,
				thing.dueDate,
				thing.startTime,
				thing.description,
				thing.tags,
				thing.completed,
				thing.id
			);
		} else {
			if (!thing.hasOwnProperty("name")) {
				return new Event(
					thing.name,
					thing.duration,
					thing.startTime,
					thing.description,
					thing.tags,
					thing.completed,
					thing.id
				)
			} else {
				return new Event(
					thing.name,
					thing.duration,
					thing.startTime,
					thing.description,
					thing.tags,
					thing.completed,
					thing.id
				)
			}
		}
	});
	return things;
}