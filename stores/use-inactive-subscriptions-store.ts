import { SUBSCRIPTION_HISTORY_PAGE_SIZE } from "@/lib/constants";
import {
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { create } from "zustand";

interface InactiveSubscriptionsState {
  pagination: PaginationState;
  sorting: SortingState;
  globalFilter: String;
}

interface InactiveSubscriptionsActions {
  setPagination: OnChangeFn<PaginationState>;
  setSorting: OnChangeFn<SortingState>;
  setGlobalFilter: OnChangeFn<string>;
}

interface InactiveSubscriptionsStore
  extends InactiveSubscriptionsState,
    InactiveSubscriptionsActions {}

const initialState = {
  pagination: {
    pageIndex: 0,
    pageSize: SUBSCRIPTION_HISTORY_PAGE_SIZE,
  },
  sorting: [],
  globalFilter: "",
};

export const useInactiveSubscriptionsStore = create<InactiveSubscriptionsStore>(
  (set) => ({
    ...initialState,

    setPagination: (updaterOrValue: Updater<PaginationState>) =>
      set((state) => {
        const newPagination =
          typeof updaterOrValue === "function"
            ? updaterOrValue(state.pagination)
            : updaterOrValue;

        return { pagination: newPagination };
      }),
    setSorting: (updaterOrValue: Updater<SortingState>) =>
      set((state) => {
        const newSorting =
          typeof updaterOrValue === "function"
            ? updaterOrValue(state.sorting)
            : updaterOrValue;
        return { sorting: newSorting };
      }),
    setGlobalFilter: (updaterOrValue: Updater<any>) =>
      set((state) => {
        const newGlobalFilter =
          typeof updaterOrValue === "function"
            ? updaterOrValue(state.globalFilter)
            : updaterOrValue;
        return { globalFilter: newGlobalFilter };
      }),
  })
);
