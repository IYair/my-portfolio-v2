import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800/50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-4 py-5 sm:px-6", className)} {...props}>
        {children}
      </div>
    );
  }
);
CardHeader.displayName = "CardHeader";

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-4 py-5 sm:p-6", className)} {...props}>
        {children}
      </div>
    );
  }
);
CardBody.displayName = "CardBody";

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-4 py-4 sm:px-6", className)} {...props}>
        {children}
      </div>
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardBody, CardFooter };
