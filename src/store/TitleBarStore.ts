import {create} from "zustand";

export enum Menu {
    Task,
    Event,
    TagBlock,
}

type CreateDialogStoreType = {
	isOpen: boolean;
	open: () => void;
	close: () => void;

	type ?: Menu;
	setType: (newType: Menu) => void;
}

export const useCreateDialogStore = create<CreateDialogStoreType>((set) => ({
	isOpen: false,
	open: () => set({isOpen: true}),
	close: () => set({isOpen: false}),
	type: undefined,
	setType: (newType: Menu) => set({ type: newType }),
}));