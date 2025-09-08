"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  disabled = true,
}: Readonly<Props>) {
  const [open, setOpen] = useState(false);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-[36px] text-sm"
          disabled={disabled}
        >
          {selected.length > 0 ? `${selected.length} selected` : placeholder}
          <CheckIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      {!disabled && (
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[250px] overflow-y-auto"
          side="bottom"
          align="start"
        >
          <Command>
            <CommandGroup>
              {options.length > 0 ? (
                options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleValue(option.value)}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 cursor-pointer",
                      selected.includes(option.value) && "bg-muted"
                    )}
                  >
                    <span>{option.label}</span>
                    <Checkbox checked={selected.includes(option.value)} />
                  </CommandItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No options available
                </div>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
