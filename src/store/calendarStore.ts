import {create} from 'zustand';
import Calendar from '../classes/calendar/Calendar';
import Thing from '../classes/thing/Thing';

type CalendarState = {
	calendar: Calendar | undefined;
	setCalendar: (calendar: Calendar) => void;
	addThing: (thing: Thing) => void;
	removeThing: (thing: Thing) => void;
	getAllThingsBetween: (from: number, to: number) => Thing[];
	getTagThingsBetween: (from: number, to: number, now: number) => Thing[];
}

const useCalendarStore = create<CalendarState>((set, get) => ({
	calendar: undefined,
	setCalendar: (calendar: Calendar) => set({calendar}),
	addThing: (thing: Thing) => set((state) => {
		if (state.calendar) {
			state.calendar.addThing(thing);
		}
		return {calendar: state.calendar};
	}),
	removeThing: (thing: Thing) => set((state) => {
		if (state.calendar) {
			state.calendar.removeThing(thing);
		}
		return {calendar: state.calendar};
	}),
	getAllThingsBetween: (from: number, to: number) => {
		const state = get(); // Use `get` to access the current state
		if (state.calendar) {
			return state.calendar.getAllThingsBetween(from, to);
		}
		return [];
	},
	getTagThingsBetween: (from: number, to: number, now: number) => {
		const state = get(); // Use `get` to access the current state
		if (state.calendar) {
			return state.calendar.getTagThingsBetween(from, to, now);
		}
		return [];
	},
}));

type CalendarOffsetStore = {
	dayOffset: number;
	setDayOffset: (offset: number) => void;
	incrementDayOffset: () => void;
	decrementDayOffset: () => void;
}

const useCalendarOffsetStore = create<CalendarOffsetStore>((set) => ({
	dayOffset: 0,
	setDayOffset: (offset: number) => set({ dayOffset: offset }),
	incrementDayOffset: () => set((state) => ({ dayOffset: state.dayOffset + 1 })),
	decrementDayOffset: () => set((state) => ({ dayOffset: state.dayOffset - 1 })),
}));

export default useCalendarStore;
export { useCalendarOffsetStore };