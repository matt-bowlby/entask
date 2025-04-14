import { create } from "zustand";
import Calendar from "../classes/calendar/Calendar";
import Thing from "../classes/thing/Thing";

type CalendarState = {
    calendar: Calendar | undefined;
    setCalendar: (calendar: Calendar | undefined) => void;
    addThing: (thing: Thing) => void;
    removeThing: (thing: Thing) => void;
    getAllThingsBetween: (from: number, to: number) => Thing[] | undefined;
    getTagThingsBetween: (from: number, to: number, now: number) => Thing[] | undefined;

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
            const newDate = new Date(
                now + (i + offset) * 24 * 60 * 60 * 1000
            );
            newDate.setHours(0, 0, 0, 0);
            dates.push(newDate);
        }

        return dates;
    }
}));

export default useCalendarStore;
