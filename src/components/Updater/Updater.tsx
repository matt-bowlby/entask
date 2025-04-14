import { useEffect } from "react";
import { create } from "zustand";

type nowStore = {
	now: number;
	setNow: (now: number) => void;
	getNowDate: () => Date;
	getDayStart: () => Date;
	getDayEnd: () => Date;
};

const useNowStore = create<nowStore>((set, get) => ({
	now: Date.now(),
	setNow: (now: number) => set({ now }),
	getNowDate: () => {
		return new Date(get().now);
	},
	getDayStart: () => {
		const nowDate = get().getNowDate();
		nowDate.setHours(0, 0, 0, 0);
		return nowDate;
	},
	getDayEnd: () => {
		const nowDate = get().getNowDate();
		nowDate.setHours(23, 59, 59, 999);
		return nowDate;
	},
}));

const Update = () => {
	const { setNow } = useNowStore();

	useEffect(() => {
		const syncToNextSecond = () => {
			const now = Date.now();
			const millisecondsUntilNextSecond = 1000 - (now % 1000);

			// Set the initial timeout to sync with the next second
			const timeout = setTimeout(() => {
				setNow(Date.now()); // Update the store with the current time

				// Start a regular interval to update every second
				const interval = setInterval(() => {
					setNow(Date.now());
				}, 1000);

				// Clear the interval when the component unmounts
				return () => clearInterval(interval);
			}, millisecondsUntilNextSecond);

			// Clear the timeout when the component unmounts
			return () => clearTimeout(timeout);
		};

		syncToNextSecond();
	}, [setNow]);

	return <></>;
};

export default Update;
export { useNowStore };