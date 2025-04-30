import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDate, formatPrice, getStatusText } from "@/lib/utils";
import { SubscriptionsGetActiveOutput } from "@/trpc/types";

import { SubscriptionsStatusActions } from "./actions";
import { SubscriptionsStatusScheduledAlert } from "./scheduled-alert";

interface SubscriptionStatusCardProps {
  activeSubscription: SubscriptionsGetActiveOutput;
}

export const SubscriptionStatusCard = ({
  activeSubscription,
}: SubscriptionStatusCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <span className="text-xl font-semibold text-foreground">
            Subscription Status
          </span>
        </CardTitle>
        {activeSubscription && (
          <div className="flex space-x-2">
            <SubscriptionsStatusActions
              status={activeSubscription.status.toLowerCase()}
              subscriptionId={activeSubscription.paddleSubscriptionId}
              billingInterval={activeSubscription.billingCycleInterval.toLowerCase()}
              scheduledChange={activeSubscription.scheduledChange as any}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {activeSubscription ? (
          <div className="space-y-4">
            <SubscriptionsStatusScheduledAlert
              activeSubscription={activeSubscription}
            />
            <div className="rounded-md border">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="active" className="ml-auto">
                        {getStatusText(activeSubscription.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Plan</TableCell>
                    <TableCell className="text-right">
                      {activeSubscription.productName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(
                        activeSubscription.priceAmount.toString(),
                        activeSubscription.priceCurrency
                      )}
                      /{activeSubscription.billingCycleInterval.toLowerCase()}
                    </TableCell>
                  </TableRow>
                  {activeSubscription.trialEndsAt && (
                    <TableRow>
                      <TableCell>Trial Period</TableCell>
                      <TableCell className="text-right">
                        Ends {formatDate(activeSubscription.trialEndsAt)}
                      </TableCell>
                    </TableRow>
                  )}
                  {activeSubscription.renewsAt && (
                    <TableRow>
                      <TableCell>Next Payment</TableCell>
                      <TableCell className="text-right">
                        {formatDate(activeSubscription.renewsAt)}
                      </TableCell>
                    </TableRow>
                  )}
                  {activeSubscription.endsAt && (
                    <TableRow>
                      <TableCell>Subscription End</TableCell>
                      <TableCell className="text-right">
                        {formatDate(activeSubscription.endsAt)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You don&apos;t have an active subscription.
            </p>
            <Button asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const SubscriptionStatusCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <span className="text-xl font-semibold text-foreground">
            Subscription Status
          </span>
        </CardTitle>
        <Skeleton className="h-9 w-9" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-32 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
