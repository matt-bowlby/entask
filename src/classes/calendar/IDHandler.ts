class IDHandler {
	/**
	 * Array of all used IDs.
	 */
	private static ids: Array<number> = [];

	/**
	 * Returns a new unique ID.
	 * @returns A new unique ID.
	 */
	static requestId(): number {
		let id: number = 0;
		while (IDHandler.ids.includes(id)) {
			id++;
		}
		IDHandler.ids.push(id);
		return id;
	}

	/**
	 * Releases an ID.
	 * @param id ID to release.
	 */
	static releaseId(id: number): void {
		IDHandler.ids = IDHandler.ids.filter((value) => value !== id);
	}
}

export { IDHandler };