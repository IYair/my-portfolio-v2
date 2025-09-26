import { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center gap-x-1.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors rounded-md";

    const variantClasses = {
      primary:
        "bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-300 disabled:text-gray-700",
      secondary:
        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline-indigo-500 disabled:bg-gray-50 disabled:text-gray-600",
      danger:
        "bg-red-500 text-white hover:bg-red-400 focus-visible:outline-red-500 disabled:bg-gray-300 disabled:text-gray-700",
      ghost:
        "text-[var(--foreground)] hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-indigo-500 disabled:text-gray-600",
    };

    const sizeClasses = {
      xs: "px-2 py-1 text-xs",
      sm: "px-2.5 py-1.5 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-3.5 py-2.5 text-sm",
    };

    const iconSizeClasses = {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-5",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className={`animate-spin ${iconSizeClasses[size]} ${iconPosition === "left" ? "-ml-0.5" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}

        {!loading && icon && iconPosition === "left" && (
          <span className={`${iconSizeClasses[size]} -ml-0.5`}>{icon}</span>
        )}

        {children}

        {!loading && icon && iconPosition === "right" && (
          <span className={`${iconSizeClasses[size]} -mr-0.5`}>{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
