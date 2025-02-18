"use client";

import { type inferProcedureOutput } from "@trpc/server";
import { ClipboardList } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SUBSCRIPTION_HISTORY_FIELDS,
  SUBSCRIPTION_HISTORY_PAGE_SIZE,
} from "@/lib/constants";
import { formatPrice, getStatusText } from "@/lib/utils";
import { AppRouter } from "@/trpc/routers/_app";


import { SubscriptionHistoryTableHead } from "./subscription-history-table-head";

type SubscriptionOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getInactive"]
>;

interface SubscriptionHistorySectionTableProps {
  subscriptions: SubscriptionOutput;
}

const SubscriptionHistoryTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        {SUBSCRIPTION_HISTORY_FIELDS.map((field, index) => (
          <SubscriptionHistoryTableHead key={index} field={field} />
        ))}
      </TableRow>
    </TableHeader>
  );
};

export const SubscriptionHistoryTableSection = ({
  subscriptions,
}: SubscriptionHistorySectionTableProps) => {
  if (subscriptions.length === 0) {
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
    <div className="rounded-md border">
      <Table>
        <SubscriptionHistoryTableHeader />
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell className="font-medium">{sub.product.name}</TableCell>
              <TableCell>
                {sub?.billing_cycle_interval === "month" ? "Monthly" : "Yearly"}
              </TableCell>
              <TableCell>
                {formatPrice(sub.price_amount.toString(), sub.price_currency)}
              </TableCell>
              <TableCell>
                {sub?.starts_at?.toLocaleDateString() || "-"}
              </TableCell>
              <TableCell>
                {sub?.ends_at?.toLocaleDateString() ||
                  sub?.canceled_at?.toLocaleDateString() ||
                  "-"}
              </TableCell>
              <TableCell>
                <Badge variant="destructive">{getStatusText(sub.status)}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const SubscriptionHistoryTableSectionSkeleton = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <SubscriptionHistoryTableHeader />
        <TableBody>
          {Array.from({ length: SUBSCRIPTION_HISTORY_PAGE_SIZE }).map(
            (_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};
