import { create } from "zustand";
import Calendar from "../classes/calendar/Calendar";
import Thing from "../classes/thing/Thing";
import debounce from "lodash.debounce";

type CalendarState = {
    calendar: Calendar | undefined;
    setCalendar: (calendar: Calendar | undefined) => void;
    addThing: (thing: Thing) => void;
    removeThing: (thing: Thing) => void;
    getAllThingsBetween: (from: number, to: number, now: number) => Thing[] | undefined;
    getTagThingsBetween: (from: number, to: number, now: number) => Thing[] | undefined;
    completeThing: (thing: Thing) => void;
    uncompleteThing: (thing: Thing) => void;

    offset: number;
    setOffset: (offset: number) => void;
    incrementOffset: () => void;
    decrementOffset: () => void;

    numDaysInView: number;
    setNumDaysInView: (numDaysInView: number) => void;
    getDatesInView: (now: number) => Date[];

    calendarUpdate: number;
    updateCalendar: () => void;
};

const useCalendarStore = create<CalendarState>((set, get) => ({
    calendar: undefined,
    setCalendar: (calendar: Calendar | undefined) => {
        set({ calendar });
        get().updateCalendar();
    },

    addThing: (thing: Thing) => {
        get().calendar?.addThing(thing);
        get().updateCalendar();
    },

    removeThing: (thing: Thing) => {
        get().calendar?.removeThing(thing);
        get().updateCalendar();
    },

    getAllThingsBetween: (from: number, to: number, now: number) => {
        return get().calendar?.getAllThingsBetween(from, to, now);
    },
    getTagThingsBetween: (from: number, to: number, now: number) => {
        const state = get();
        return state?.calendar?.getTagThingsBetween(from, to, now);
    },
    completeThing: (thing: Thing) => {
        get().calendar?.completeThing(thing);
        get().updateCalendar();
    },
    uncompleteThing: (thing: Thing) => {
        get().calendar?.uncompleteThing(thing);
        get().updateCalendar();
    },

    offset: 0,
    setOffset: (offset: number) => set({ offset }),
    incrementOffset: () => set((state) => ({ offset: state.offset + 1 })),
    decrementOffset: () => set((state) => ({ offset: state.offset - 1 })),

    numDaysInView: 5,
    setNumDaysInView: (numDaysInView: number) => set({ numDaysInView }),
    getDatesInView: (now: number) => {
        const state = get();
        const { numDaysInView, offset } = state;
        const dates: Date[] = [];

        for (let i = 0; i < numDaysInView; i++) {
            const newDate = new Date(now + (i + offset) * 24 * 60 * 60 * 1000);
            newDate.setHours(0, 0, 0, 0);
            dates.push(newDate);
        }

        return dates;
    },

    calendarUpdate: 0,
    updateCalendar: () => {
        set((state) => ({ calendarUpdate: state.calendarUpdate + 1 }));
    }
}));

type ScrollState = {
    scrollTop: number;
    setScrollTop: (scrollTop: number) => void;
    resetScrollTop: () => void;
};

const useScrollStore = create<ScrollState>((set) => ({
    scrollTop: 0,
    setScrollTop: (scrollTop: number) => set({ scrollTop }),
    resetScrollTop: () => {
        const now = new Date();
        const calendarBody = document.getElementById("calendar-body");
        const hourMarker = document.getElementById(`hour-marker-${now.getHours()}`);
        if (calendarBody && hourMarker) {
            calendarBody.scrollTo({
                top: hourMarker.offsetTop,
                behavior: "smooth",
            });
        }
    },
}));

async function triggerSave(calendarState: Calendar | undefined) {
    if (!calendarState) {
        console.warn("attempting to save blank calendar state");
        return;
    } else {
        await window.electronAPI.saveCalendar(calendarState.toJson());
    }
}

// will only update once a second so rapid changes will not affect performance
const debouncedSave = debounce(triggerSave, 1000);

// subscription to track if calendar state ever updates
let previousCalendarVersion = 0;
useCalendarStore.subscribe((state) => {
    const currentCalendarState = state.calendarUpdate;

    if (currentCalendarState !== previousCalendarVersion) {
        debouncedSave(state.calendar);
        previousCalendarVersion = currentCalendarState;
    }
});

export default useCalendarStore;
export { useScrollStore };
