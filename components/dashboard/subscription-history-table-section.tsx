"use client";

import { type inferProcedureOutput } from "@trpc/server";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SUBSCRIPTION_HISTORY_PAGE_SIZE } from "@/lib/constants";
import { formatDate, formatPrice, getStatusText } from "@/lib/utils";
import { AppRouter } from "@/trpc/routers/_app";

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
        <TableHead>
          <Button variant="ghost" className="h-8 p-0">
            Product
            <ArrowUpDown className="size-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" className="h-8 p-0">
            Interval
            <ArrowUpDown className="size-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" className="h-8 p-0">
            Price
            <ArrowUpDown className="size-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" className="h-8 p-0">
            Start Date
            <ArrowUpDown className="size-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" className="h-8 p-0">
            End Date
            <ArrowUpDown className="size-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" className="h-8 p-0">
            Status
            <ArrowUpDown className="size-4" />
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export const SubscriptionHistoryTableSection = ({
  subscriptions,
}: SubscriptionHistorySectionTableProps) => {
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
