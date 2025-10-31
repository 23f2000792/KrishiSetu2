
'use client';
import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge";
import { CROP_OPTIONS } from "./onboarding-form";

type CropMultiSelectProps = {
    selected: string[];
    onChange: (value: string[]) => void;
    className?: string;
}

export function CropMultiSelect({ selected, onChange, className }: CropMultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    if (selected.includes(currentValue)) {
        onChange(selected.filter((v) => v !== currentValue));
    } else {
        if(selected.length < 5) {
            onChange([...selected, currentValue]);
        }
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-auto"
                >
                <div className="flex gap-1 flex-wrap">
                    {selected.length > 0 ? (
                        selected.map((value) => (
                            <Badge
                                key={value}
                                variant="secondary"
                                className="mr-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(value);
                                }}
                            >
                                {value}
                                <X className="ml-1 h-3 w-3" />
                            </Badge>
                        ))
                    ) : (
                       <span className="text-muted-foreground">Select crops...</span>
                    )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                <CommandInput placeholder="Search crops..." />
                <CommandList>
                    <CommandEmpty>No crop found.</CommandEmpty>
                    <CommandGroup>
                        {CROP_OPTIONS.map((option) => (
                        <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={handleSelect}
                            disabled={selected.length >= 5 && !selected.includes(option.value)}
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {option.label}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
         {selected.length > 0 && selected.length < 5 &&(
             <p className="text-xs text-muted-foreground">{5 - selected.length} more can be selected.</p>
         )}
    </div>
  )
}
