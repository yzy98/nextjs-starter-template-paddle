import { inferProcedureOutput } from "@trpc/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice, getStatusText } from "@/lib/utils";
import { AppRouter } from "@/trpc/routers/_app";

import { SubscriptionActions } from "./subscription-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SubscriptionScheduledBanner } from "./subscription-scheduled-banner";

type SubscriptionOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getActive"]
>;

interface SubscriptionStatusSectionProps {
  activeSubscription: SubscriptionOutput;
}

export const SubscriptionStatusSection = ({
  activeSubscription,
}: SubscriptionStatusSectionProps) => {
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
            <SubscriptionActions
              status={activeSubscription.status.toLowerCase()}
              subscriptionId={activeSubscription.paddle_subscription_id}
              billingInterval={activeSubscription.billing_cycle_interval.toLowerCase()}
              scheduledChange={activeSubscription.scheduled_change as any}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {activeSubscription ? (
          <div className="space-y-4">
            <SubscriptionScheduledBanner
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
                      {activeSubscription.product.name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(
                        activeSubscription.price_amount.toString(),
                        activeSubscription.price_currency
                      )}
                      /{activeSubscription.billing_cycle_interval.toLowerCase()}
                    </TableCell>
                  </TableRow>
                  {activeSubscription.trial_ends_at && (
                    <TableRow>
                      <TableCell>Trial Period</TableCell>
                      <TableCell className="text-right">
                        Ends {formatDate(activeSubscription.trial_ends_at)}
                      </TableCell>
                    </TableRow>
                  )}
                  {activeSubscription.renews_at && (
                    <TableRow>
                      <TableCell>Next Payment</TableCell>
                      <TableCell className="text-right">
                        {formatDate(activeSubscription.renews_at)}
                      </TableCell>
                    </TableRow>
                  )}
                  {activeSubscription.ends_at && (
                    <TableRow>
                      <TableCell>Subscription End</TableCell>
                      <TableCell className="text-right">
                        {formatDate(activeSubscription.ends_at)}
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
              <a href="/pricing">View Plans</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const SubscriptionStatusSectionSkeleton = () => {
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
