"use client";

import { use, useState } from "react";
import { Suspense } from "react";

import { Copy, CopyCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { getStatusText } from "@/lib/utils";
import { Product, Subscription } from "@/server/db/schema";

type SubscriptionDetailProps = {
  subscriptionPromise: Promise<
    {
      subscription: Subscription;
      product: Product;
    }[]
  >;
};

export const SubscriptionDetail = ({
  subscriptionPromise,
}: SubscriptionDetailProps) => {
  return (
    <Suspense fallback={<SubscriptionDetailSkeleton />}>
      <SubscriptionDetailSuspense subscriptionPromise={subscriptionPromise} />
    </Suspense>
  );
};

const SubscriptionDetailSuspense = ({
  subscriptionPromise,
}: SubscriptionDetailProps) => {
  const [copied, setCopied] = useState(false);
  const [{ subscription, product }] = use(subscriptionPromise);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "🎉 Copied to clipboard!",
      });
      setTimeout(() => setCopied(false), 5000);
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to copy to clipboard!",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl font-semibold text-foreground">
            Subscription
          </span>
          <Badge className="flex items-center gap-1">
            {subscription.paddleSubscriptionId}
            {copied ? (
              <CopyCheck className="size-3 text-chart-2" />
            ) : (
              <Copy
                className="size-3 cursor-pointer"
                onClick={() =>
                  copyToClipboard(subscription.paddleSubscriptionId)
                }
              />
            )}
          </Badge>
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
                <TableCell className="text-right">{product.name}</TableCell>
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

const SubscriptionDetailSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl font-semibold text-foreground">
            Subscription
          </span>
          <Skeleton className="h-6 w-56 rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableBody>
              {/* Status row */}
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-20 rounded-full ml-auto" />
                </TableCell>
              </TableRow>

              {/* Plan row */}
              <TableRow>
                <TableCell>Plan</TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-5 w-24 ml-auto" />
                </TableCell>
              </TableRow>

              {/* Price row */}
              <TableRow>
                <TableCell>Price</TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-5 w-28 ml-auto" />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-5 w-32 ml-auto" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-5 w-32 ml-auto" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
