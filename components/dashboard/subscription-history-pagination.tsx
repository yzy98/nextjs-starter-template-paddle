import { ChevronRight, ChevronLeft } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { SUBSCRIPTION_HISTORY_PAGE_SIZE } from "@/lib/constants";
import { useInactiveSubscriptionsStore } from "@/stores/use-inactive-subscriptions-store";

import { Skeleton } from "../ui/skeleton";

export const SubscriptionHistoryPagination = ({
  totalCount,
}: {
  totalCount: number;
}) => {
  const totalPages = Math.ceil(totalCount / SUBSCRIPTION_HISTORY_PAGE_SIZE);
  const { currentPage, nextPage, previousPage } =
    useInactiveSubscriptionsStore();

  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    previousPage();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    nextPage();
  };

  return (
    <Pagination>
      <PaginationContent className="gap-3">
        <PaginationItem>
          <PaginationLink
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#"
            onClick={handlePrevClick}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1}
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Page <span className="text-foreground">{currentPage}</span> of{" "}
            <span className="text-foreground">{totalPages}</span>
          </p>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#"
            onClick={handleNextClick}
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export const SubscriptionHistoryPaginationSkeleton = () => {
  return (
    <Pagination>
      <Skeleton className="h-8 w-52" />
    </Pagination>
  );
};
