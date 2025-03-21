"use client";

import { Subscription } from "@/server/db/schema";
import { use } from "react";
import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getStatusText } from "@/lib/utils";

type SubscriptionDetailProps = {
  subscriptionPromise: Promise<Subscription[]>;
};

export const SubscriptionDetail = ({
  subscriptionPromise,
}: SubscriptionDetailProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscriptionDetailSuspense subscriptionPromise={subscriptionPromise} />
    </Suspense>
  );
};

const SubscriptionDetailSuspense = ({
  subscriptionPromise,
}: SubscriptionDetailProps) => {
  const [subscription] = use(subscriptionPromise);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl font-semibold text-foreground">
            Subscription
          </span>
          <Badge>{subscription.paddleSubscriptionId}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="ml-auto">
                    {getStatusText(subscription.status)}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Plan</TableCell>
                <TableCell className="text-right">
                  {subscription.productId}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Price</TableCell>
                <TableCell className="text-right">
                  {formatPrice(
                    subscription.priceAmount.toString(),
                    subscription.priceCurrency
                  )}
                  /{subscription.billingCycleInterval.toLowerCase()}
                </TableCell>
              </TableRow>
              {subscription.startsAt && (
                <TableRow>
                  <TableCell>Subscription Started</TableCell>
                  <TableCell className="text-right">
                    {formatDate(subscription.startsAt)}
                  </TableCell>
                </TableRow>
              )}
              {subscription.trialStartsAt && (
                <TableRow>
                  <TableCell>Trial Started</TableCell>
                  <TableCell className="text-right">
                    {formatDate(subscription.trialStartsAt)}
                  </TableCell>
                </TableRow>
              )}
              {subscription.trialEndsAt && (
                <TableRow>
                  <TableCell>Trial Ended</TableCell>
                  <TableCell className="text-right">
                    {formatDate(subscription.trialEndsAt)}
                  </TableCell>
                </TableRow>
              )}
              {subscription.endsAt && (
                <TableRow>
                  <TableCell>Subscription End</TableCell>
                  <TableCell className="text-right">
                    {formatDate(subscription.endsAt)}
                  </TableCell>
                </TableRow>
              )}
              {subscription.canceledAt && (
                <TableRow>
                  <TableCell>Subscription Canceled</TableCell>
                  <TableCell className="text-right">
                    {formatDate(subscription.canceledAt)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
