"use client";

import { Fragment } from "react";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const DashboardBreadcrumb = () => {
  const pathname = usePathname();
  const pathnameParts = pathname
    .split("/")
    .filter((path) => !["", "dashboard"].includes(path));

  const breadcrumbItems = pathnameParts.map((part, index) => {
    const isLast = index === pathnameParts.length - 1;
    const href = `/dashboard/${pathnameParts.slice(0, index + 1).join("/")}`;

    // Format the segment for display (capitalize, replace hyphens)
    const title = part
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      title,
      href,
      isLast,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item) => (
          <Fragment key={item.title}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
