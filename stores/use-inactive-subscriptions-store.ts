import { create } from "zustand";

interface InactiveSubscriptionsState {
  currentPage: number;
}

interface InactiveSubscriptionsActions {
  nextPage: () => void;
  previousPage: () => void;
}

interface InactiveSubscriptionsStore
  extends InactiveSubscriptionsState,
    InactiveSubscriptionsActions {}

const initialState = {
  currentPage: 1,
};

export const useInactiveSubscriptionsStore = create<InactiveSubscriptionsStore>(
  (set) => ({
    ...initialState,

    nextPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),
    previousPage: () =>
      set((state) => ({ currentPage: state.currentPage - 1 })),
  })
);
