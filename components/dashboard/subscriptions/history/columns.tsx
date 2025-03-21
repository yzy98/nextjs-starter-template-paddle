"use client";

import { ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DATA_TABLE_ID_TITLE_MAP } from "@/lib/constants";
import { formatPrice, getStatusText } from "@/lib/utils";
import { AppRouter } from "@/trpc/routers/_app";
import Link from "next/link";

type SubscriptionsHistoryOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getInactive"]
>;

type SubscriptionsHistory = SubscriptionsHistoryOutput[number];

export const columns: ColumnDef<SubscriptionsHistory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={DATA_TABLE_ID_TITLE_MAP["productName"]}
      />
    ),
  },
  {
    accessorKey: "billingCycleInterval",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={DATA_TABLE_ID_TITLE_MAP["billingCycleInterval"]}
      />
    ),
    cell: ({ row }) => {
      const interval = row.getValue("billingCycleInterval");
      return <div>{interval === "month" ? "Monthly" : "Yearly"}</div>;
    },
  },
  {
    accessorKey: "priceAmount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={DATA_TABLE_ID_TITLE_MAP["priceAmount"]}
      />
    ),
    cell: ({ row }) => {
      const sub = row.original;
      const priceAmount: string = row.getValue("priceAmount");
      const priceCurrency = sub.priceCurrency;
      const formattedPriceAmount = formatPrice(
        priceAmount.toString(),
        priceCurrency
      );

      return <div>{formattedPriceAmount}</div>;
    },
  },
  {
    accessorKey: "startsAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={DATA_TABLE_ID_TITLE_MAP["startsAt"]}
      />
    ),
    cell: ({ row }) => {
      const startDate: Date | null = row.getValue("startsAt");
      const startStr = startDate?.toLocaleDateString() || "-";

      return <div>{startStr}</div>;
    },
  },
  {
    accessorKey: "endsAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={DATA_TABLE_ID_TITLE_MAP["endsAt"]}
      />
    ),
    cell: ({ row }) => {
      const sub = row.original;
      const endDate: Date | null = row.getValue("endsAt");
      const cancelDate = sub.canceledAt;
      const endStr =
        endDate?.toLocaleDateString() ||
        cancelDate?.toLocaleDateString() ||
        "-";

      return <div>{endStr}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={DATA_TABLE_ID_TITLE_MAP["status"]}
      />
    ),
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const statusStr = getStatusText(status);

      return <div>{statusStr}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subscription = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(subscription.paddleSubscriptionId)
              }
            >
              Copy Subscription ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/subscriptions/history/${subscription.paddleSubscriptionId}`}
              >
                View Subscription Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];
