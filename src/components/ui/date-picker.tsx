"use client";

import * as React from "react";
import { format } from "@formkit/tempo";
import { CalendarIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import { ShadcnButton } from "@/components/ui/shadcn-button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Seleccionar fecha",
  disabled = false,
  className,
}: DatePickerProps) {
  // Validate date is a valid Date object
  const isValidDate = date instanceof Date && !isNaN(date.getTime());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ShadcnButton
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !isValidDate && "text-gray-500 dark:text-gray-400",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isValidDate ? format(date, "full", "es") : <span>{placeholder}</span>}
        </ShadcnButton>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isValidDate ? date : undefined}
          onSelect={onDateChange}
          disabled={date => date > new Date() || date < new Date("1900-01-01")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
