import { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "error";
  resize?: "none" | "both" | "horizontal" | "vertical";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      label,
      error,
      helperText,
      variant = "default",
      resize = "vertical",
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperTextId = helperText ? `${textareaId}-helper` : undefined;

    const isError = variant === "error" || !!error;

    const baseTextareaClasses =
      "block w-full rounded-md px-3 py-2 text-sm transition-colors focus:outline focus:outline-2 focus:-outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      default:
        "bg-white dark:bg-gray-800 border-0 text-[var(--foreground)] ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600",
      error:
        "bg-white dark:bg-gray-800 border-0 text-red-900 dark:text-red-400 ring-1 ring-inset ring-red-300 dark:ring-red-600 placeholder:text-red-300 dark:placeholder:text-red-400 focus:ring-2 focus:ring-inset focus:ring-red-600",
    };

    const resizeClasses = {
      none: "resize-none",
      both: "resize",
      horizontal: "resize-x",
      vertical: "resize-y",
    };

    const currentVariant = isError ? "error" : "default";

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`${baseTextareaClasses} ${variantClasses[currentVariant]} ${resizeClasses[resize]} ${className}`}
          aria-invalid={isError}
          aria-describedby={[errorId, helperTextId].filter(Boolean).join(" ") || undefined}
          {...props}
        />

        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperTextId} className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
