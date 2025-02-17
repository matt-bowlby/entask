import "./App.css";
import React, { useRef } from "react";
import {Event, Task} from "@classes/thing/Thing";
import Calendar from "@classes/calendar/Calendar";

function App() {
  const calendar = useRef(new Calendar("My Calendar"));
  const [thingList, setThingList] = React.useState(calendar.current.getActiveThings());

  const handleAddEvent = () => {
    calendar.current.addEvent(new Event("My Event", 0));
    setThingList(calendar.current.getActiveThings());
  };

  const handleAddTask = () => {
    const task = new Task("My Task", 0);
    calendar.current.addTask(task);
    setThingList(calendar.current.getActiveThings());
  };

  return (
    <>
      <button className="regular-button" onClick={handleAddEvent}>Add Event</button>
      <button className="regular-button" onClick={handleAddTask}>Add Task</button>
      <p>{thingList.length()} items active</p>
    </>
  );
}

export default App;
