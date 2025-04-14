import { useEffect } from "react"
import { create } from "zustand"

type nowStore = {
	now: number
	setNow: (now: number) => void
	getNowDate: () => Date
	getDayStart: () => Date
	getDayEnd: () => Date
}

const useNowStore = create<nowStore>((set, get) => ({
	now: 0,
	setNow: (now: number) => set({ now }),
	getNowDate: () => { return new Date(get().now); },
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
}))

const Update = () => {
	const { now: nowMs, setNow } = useNowStore()

	useEffect(() => {
		let now = new Date()
		const interval = setInterval(() => {
			now = new Date();
			if (now.getSeconds() === new Date(nowMs).getSeconds()) {
				return;
			}
			setNow(now.getTime())
		}, 1000); // Set interval to 1000ms (1 second)

		return () => clearInterval(interval);
	}, []);

	return <></>
}

export default Update;
export { useNowStore }