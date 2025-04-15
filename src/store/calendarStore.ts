import { create } from "zustand";
import Calendar from "../classes/calendar/Calendar";
import Thing from "../classes/thing/Thing";
import debounce from "lodash.debounce";

type CalendarState = {
    calendar: Calendar | undefined;
    setCalendar: (calendar: Calendar | undefined) => void;
    addThing: (thing: Thing) => void;
    removeThing: (thing: Thing) => void;
    getAllThingsBetween: (from: number, to: number) => Thing[] | undefined;
    getTagThingsBetween: (
        from: number,
        to: number,
        now: number
    ) => Thing[] | undefined;

    offset: number;
    setOffset: (offset: number) => void;
    incrementOffset: () => void;
    decrementOffset: () => void;

    numDaysInView: number;
    setNumDaysInView: (numDaysInView: number) => void;

    getDatesInView: (now: number) => Date[];
};

const useCalendarStore = create<CalendarState>((set, get) => ({
    calendar: undefined,
    setCalendar: (calendar: Calendar | undefined) => set({ calendar }),
    addThing: (thing: Thing) =>
        set((state) => {
            const newCalendar = state?.calendar?.clone();
            newCalendar?.addThing(thing);
            return { calendar: newCalendar };
        }),
    removeThing: (thing: Thing) =>
        set((state) => {
            const newCalendar = state?.calendar?.clone();
            newCalendar?.removeThing(thing);
            return { calendar: newCalendar };
        }),
    getAllThingsBetween: (from: number, to: number) => {
        const state = get();
        return state?.calendar?.getAllThingsBetween(from, to);
    },
    getTagThingsBetween: (from: number, to: number, now: number) => {
        const state = get();
        return state?.calendar?.getTagThingsBetween(from, to, now);
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
        const hourMarker = document.getElementById(
            `hour-marker-${now.getHours()}`
        );
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
let previousCalendarState = useCalendarStore.getState().calendar;
useCalendarStore.subscribe((state) => {
    const currentCalendarState = state.calendar;

    if (currentCalendarState !== previousCalendarState) {
        debouncedSave(currentCalendarState);
        previousCalendarState = currentCalendarState;
    }
});

export default useCalendarStore;
export { useScrollStore };
