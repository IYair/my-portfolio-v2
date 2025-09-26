import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "error";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "default",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperTextId = helperText ? `${inputId}-helper` : undefined;

    const isError = variant === "error" || !!error;

    const baseInputClasses =
      "block w-full rounded-md py-1.5 text-sm transition-colors focus:outline focus:outline-2 focus:-outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      default:
        "bg-white dark:bg-gray-800 border-0 text-[var(--foreground)] ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600",
      error:
        "bg-white dark:bg-gray-800 border-0 text-red-900 dark:text-red-400 ring-1 ring-inset ring-red-300 dark:ring-red-600 placeholder:text-red-300 dark:placeholder:text-red-400 focus:ring-2 focus:ring-inset focus:ring-red-600",
    };

    const currentVariant = isError ? "error" : "default";

    // Adjust padding based on icons
    let paddingClasses = "px-3";
    if (leftIcon && rightIcon) {
      paddingClasses = "pl-10 pr-10";
    } else if (leftIcon) {
      paddingClasses = "pl-10 pr-3";
    } else if (rightIcon) {
      paddingClasses = "pl-3 pr-10";
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`${baseInputClasses} ${variantClasses[currentVariant]} ${paddingClasses} ${className}`}
            aria-invalid={isError}
            aria-describedby={[errorId, helperTextId].filter(Boolean).join(" ") || undefined}
            {...props}
          />

          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <div
                className={`size-5 ${isError ? "text-red-400" : "text-gray-400 dark:text-gray-500"}`}
              >
                {leftIcon}
              </div>
            </div>
          )}

          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div
                className={`size-5 ${isError ? "text-red-400" : "text-gray-400 dark:text-gray-500"}`}
              >
                {rightIcon}
              </div>
            </div>
          )}
        </div>

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

Input.displayName = "Input";

export default Input;
