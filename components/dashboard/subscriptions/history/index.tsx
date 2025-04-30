import { SubscriptionsHistoryContent } from "@/components/dashboard/subscriptions/history/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export const SubscriptionsHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="text-xl font-semibold text-foreground">
            Subscription History
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SubscriptionsHistoryContent />
      </CardContent>
    </Card>
  );
};
