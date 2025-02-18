import { create } from "zustand";

export type SortDirection = "asc" | "desc";
export type SortField =
  | "plan"
  | "interval"
  | "price"
  | "status"
  | "start"
  | "end";

export interface InactiveSubscriptionsSortParams {
  direction: SortDirection;
  field: SortField;
}

interface InactiveSubscriptionsState {
  currentPage: number;
  sortParams?: InactiveSubscriptionsSortParams;
}

interface InactiveSubscriptionsActions {
  nextPage: () => void;
  previousPage: () => void;
  sortFn: (params: InactiveSubscriptionsSortParams) => void;
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
    sortFn: (params: InactiveSubscriptionsSortParams) =>
      set(() => ({ sortParams: params })),
  })
);
