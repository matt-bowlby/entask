import { useEffect } from "react"
import { create } from "zustand"

type nowStore = {
	now: number
	setNow: (now: number) => void
}

const useNowStore = create<nowStore>(set => ({
	now: 0,
	setNow: (now: number) => set({ now })
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