import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";

import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useInactiveSubscriptionsStore } from "@/stores/use-inactive-subscriptions-store";
import { useTRPC } from "@/trpc/client";


interface SubscriptionsHistoryPaginationProps<TData> {
  table: Table<TData>;
  setTotalCount: (totalCount: number) => void;
}

export function SubscriptionsHistoryPagination<TData>({
  table,
  setTotalCount,
}: SubscriptionsHistoryPaginationProps<TData>) {
  const trpc = useTRPC();
  const { globalFilter } = useInactiveSubscriptionsStore();

  const { data: totalCount } = useQuery(
    trpc.subscriptions.countInactive.queryOptions({
      ...(globalFilter.length > 0 && {
        globalFilter: globalFilter as string,
      }),
    })
  );

  useEffect(() => {
    if (totalCount !== undefined) {
      setTotalCount(totalCount);
    }
  }, [totalCount, setTotalCount]);

  return <DataTablePagination table={table} />;
}
