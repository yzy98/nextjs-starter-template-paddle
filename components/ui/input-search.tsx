import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

export const InputSearch = ({
  value,
  onChange,
  className,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        {...props}
        className={cn("pl-8 pr-8", className)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-2.5 h-4 w-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </button>
      )}
    </div>
  );
};
