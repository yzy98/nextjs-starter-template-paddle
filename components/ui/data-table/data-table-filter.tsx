"use client";

import { Table } from "@tanstack/react-table";

import { InputSearch } from "@/components/ui/input-search";

interface DataTableFilterProps<TData> {
  table: Table<TData>;
}

export function DataTableFilter<TData>({ table }: DataTableFilterProps<TData>) {
  return (
    <InputSearch
      placeholder="Search..."
      value={(table.getState().globalFilter as string) ?? ""}
      onChange={(value) => table.setGlobalFilter(value)}
      className="max-w-sm"
    />
  );
}
