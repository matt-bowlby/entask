import "./App.css";
import React, { useRef } from "react";
import { Event, Task } from "@classes/thing/Thing";
import Calendar from "@classes/calendar/Calendar";

function App() {
  const calendar = useRef(new Calendar("My Calendar"));
  const [thingList, setThingList] = React.useState(
    calendar.current.getActiveThings()
  );

  const handleAddEvent = () => {
    calendar.current.addThing(new Event("My Event", 0));
    setThingList(calendar.current.getActiveThings());
  };

  const handleAddTask = () => {
    const task = new Task("My Task", 0);
    calendar.current.addThing(task);
    setThingList(calendar.current.getActiveThings());
  };

  return (
    <>
      <button
        className="rounded-full bg-blue-300 mx-2 p-2"
        onClick={handleAddEvent}
      >
        Add Event
      </button>
      <button
        className="rounded-full bg-blue-300 mx-2 p-2"
        onClick={handleAddTask}
      >
        Add Task
      </button>
      <p>{thingList.length()} items active</p>
    </>
  );
}

export default App;
