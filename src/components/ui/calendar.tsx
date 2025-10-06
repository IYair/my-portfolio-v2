"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { ShadcnButton, buttonVariants } from "@/components/ui/shadcn-button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof ShadcnButton>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("group/calendar bg-white p-3 [--cell-size:2rem] dark:bg-gray-800", className)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: date => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col md:flex-row relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-8 p-0",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-8 p-0",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-8 w-full",
          defaultClassNames.month_caption
        ),
        caption_label: cn("text-sm font-medium", defaultClassNames.caption_label),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-gray-500 dark:text-gray-400 rounded-md flex-1 font-normal text-[0.8rem]",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn(
          "relative w-full h-full p-0 text-center group/day aspect-square",
          defaultClassNames.day
        ),
        today: cn("bg-gray-100 dark:bg-gray-800 rounded-md", defaultClassNames.today),
        outside: cn("text-gray-500 dark:text-gray-400 opacity-50", defaultClassNames.outside),
        disabled: cn("text-gray-500 dark:text-gray-400 opacity-50", defaultClassNames.disabled),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") return <ChevronLeftIcon className="size-4" />;
          if (orientation === "right") return <ChevronRightIcon className="size-4" />;
          return <ChevronDownIcon className="size-4" />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day: _day,
  modifiers: _modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  return (
    <ShadcnButton
      variant="ghost"
      size="icon"
      className={cn(
        "size-8 font-normal hover:bg-gray-100 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white dark:hover:bg-gray-800",
        className
      )}
      {...props}
    />
  );
}

export { Calendar };
