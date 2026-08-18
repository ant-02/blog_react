import { useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MultiSelectOption {
  label: string;
  value: number;
}

interface MultiSelectProps {
  options?: MultiSelectOption[];
  value?: number[];
  onChange?: (value: number[]) => void;
  placeholder?: string;
  loading?: boolean;
}

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "请选择",
  loading,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleValue = (selectedValue: number) => {
    const next = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange?.(next);
  };

  const removeValue = (selectedValue: number) => {
    onChange?.(value.filter((v) => v !== selectedValue));
  };

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v))
    .filter(Boolean) as MultiSelectOption[];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex min-h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="flex flex-wrap gap-1">
          {selectedLabels.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedLabels.map((item) => (
              <Badge key={item.value} variant="secondary" className="gap-0.5 pr-0.5">
                {item.label}
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-0.5 rounded-sm opacity-70 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(item.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      removeValue(item.value);
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            ))
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2">
        {loading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">加载中...</div>
        ) : options.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">暂无选项</div>
        ) : (
          <div className="flex max-h-60 flex-col gap-1 overflow-auto">
            {options.map((option) => {
              const checked = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
                  onClick={() => toggleValue(option.value)}
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggleValue(option.value)} />
                  <span className="flex-1 text-sm">{option.label}</span>
                  {checked && <Check className="h-4 w-4 text-primary" />}
                </div>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
