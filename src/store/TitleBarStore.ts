import {create} from "zustand";

type CreateDialogStoreType = {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

export const useCreateDialogStore = create<CreateDialogStoreType>((set) => ({
	isOpen: false,
	open: () => set({isOpen: true}),
	close: () => set({isOpen: false}),
}));