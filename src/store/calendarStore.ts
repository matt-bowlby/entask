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
}));

type CalendarOffsetStore = {
    dayOffset: number;
    setDayOffset: (offset: number) => void;
    incrementDayOffset: () => void;
    decrementDayOffset: () => void;
};

const useCalendarOffsetStore = create<CalendarOffsetStore>((set) => ({
    dayOffset: 0,
    setDayOffset: (offset: number) => set({ dayOffset: offset }),
    incrementDayOffset: () =>
        set((state) => ({ dayOffset: state.dayOffset + 1 })),
    decrementDayOffset: () =>
        set((state) => ({ dayOffset: state.dayOffset - 1 })),
}));

export default useCalendarStore;
export { useCalendarOffsetStore };
