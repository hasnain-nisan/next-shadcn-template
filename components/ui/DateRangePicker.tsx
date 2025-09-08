import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

type Props = {
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  className?: string;
};

export function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  className,
}: Readonly<Props>) {
  const selected: DateRange = {
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  };

  const normalizeToMidnightUTC = (date: Date | undefined): string | null => {
    if (!date) return null;

    // Create a new date with the same year, month, day but in UTC
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    );

    return utcDate.toISOString();
  };

  const handleSelect = (range: DateRange | undefined) => {
    console.log(range?.from, range?.to);
    console.log(normalizeToMidnightUTC(range?.from), normalizeToMidnightUTC(range?.to));
    
    setStartDate(normalizeToMidnightUTC(range?.from));
    setEndDate(normalizeToMidnightUTC(range?.to));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date-range"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !startDate && !endDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {startDate && endDate ? (
            <>
              {format(new Date(startDate), "MMM d, yyyy")} –{" "}
              {format(new Date(endDate), "MMM d, yyyy")}
            </>
          ) : (
            <span>Select date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
