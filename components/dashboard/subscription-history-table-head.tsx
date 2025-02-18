import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  SortField,
  useInactiveSubscriptionsStore,
} from "@/stores/use-inactive-subscriptions-store";

interface SubscriptionHistoryTableHeadProps {
  field: SortField;
}

export const SubscriptionHistoryTableHead = ({
  field,
}: SubscriptionHistoryTableHeadProps) => {
  const { sortParams, sortFn } = useInactiveSubscriptionsStore();

  const getSortIcon = (field: SortField) => {
    if (!sortParams) {
      return <ArrowUpDown className="size-4" />;
    }

    if (field === sortParams.field) {
      return sortParams.direction === "asc" ? (
        <ArrowUp className="size-4" />
      ) : (
        <ArrowDown className="size-4" />
      );
    }

    return <ArrowUpDown className="size-4" />;
  };

  const handleClickTableHead = () => {
    const newDirection =
      field === sortParams?.field
        ? sortParams.direction === "asc"
          ? "desc"
          : "asc"
        : "asc";

    sortFn({
      field,
      direction: newDirection,
    });
  };

  return (
    <TableHead>
      <div
        className={cn(
          "flex items-center gap-1 cursor-pointer hover:text-primary",
          field === sortParams?.field && "text-primary font-semibold"
        )}
        onClick={handleClickTableHead}
      >
        {field.charAt(0).toUpperCase() + field.slice(1)}
        {getSortIcon(field)}
      </div>
    </TableHead>
  );
};
