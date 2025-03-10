import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { ClipboardList } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useInactiveSubscriptionsStore } from "@/stores/use-inactive-subscriptions-store";
import { AppRouter } from "@/trpc/routers/_app";

import { columns } from "./columns";

type InactiveSubscriptionsOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getInactive"]
>;

interface InactiveSubscriptionsTableProps {
  subscriptions: InactiveSubscriptionsOutput;
  totalCount: number;
}

export const InactiveSubscriptionsTable = ({
  subscriptions,
  totalCount,
}: InactiveSubscriptionsTableProps) => {
  const { pagination, setPagination, sorting, setSorting } =
    useInactiveSubscriptionsStore();

  const table = useReactTable({
    data: subscriptions,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    manualSorting: true,
    enableMultiSort: false, // TODO: Add multi-sorting
    getCoreRowModel: getCoreRowModel(),
  });

  if (totalCount === 0) {
    return (
      <Alert>
        <ClipboardList className="size-4" />
        <AlertTitle>No subscription history!</AlertTitle>
        <AlertDescription>
          Your subscription history will appear here when they end or are
          canceled.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  );
};
