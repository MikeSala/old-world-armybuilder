"use client";

// Reusable UI Button component with customizable variants, sizes, icons, and loading state

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type ReactNode,
} from "react";

// 🔹 TS: Types representing the possible variants and sizes for the Button component
type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "gradient";
type ButtonSize = "sm" | "md" | "lg";

// 🔹 TS: Props interface for the Button component, extending native button attributes
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Utility function to merge conditional class names into a single string
function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

// Base classes shared by all button variants and sizes for consistent styling and behavior
const baseClasses =
  "relative inline-flex items-center justify-center gap-2 font-semibold tracking-wide uppercase transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 shadow-sm";

// Styling classes specific to each button variant, defining colors, borders, and hover/focus states
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "rounded-md border border-stone-900 bg-stone-800 text-amber-100 hover:bg-stone-900 focus-visible:ring-amber-400 focus-visible:ring-offset-stone-900",
  secondary:
    "rounded-md border border-amber-500 bg-transparent text-amber-500 hover:bg-amber-500/10 focus-visible:ring-amber-300 focus-visible:ring-offset-stone-800",
  ghost:
    "rounded-md border border-transparent bg-transparent text-stone-700 hover:border-stone-500 hover:bg-stone-100/40 focus-visible:ring-stone-400 focus-visible:ring-offset-stone-900",
  outline:
    "rounded-md border border-stone-700 bg-stone-900/60 text-amber-200 hover:bg-stone-900 focus-visible:ring-amber-300 focus-visible:ring-offset-stone-800",
  gradient:
    "rounded-md border border-amber-600 bg-gradient-to-br from-amber-600 via-red-700 to-stone-900 text-amber-100 shadow-lg hover:-translate-y-0.5 hover:from-amber-500 hover:via-red-600 hover:to-stone-800 focus-visible:ring-amber-300 focus-visible:ring-offset-stone-900",
};

// Styling classes defining padding and font size for each button size option
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

// Class to make the button take full width of its container when enabled
const fullWidthClass = "w-full";

// Spinner styling for the loading state, showing a rotating border animation
const spinnerClass =
  "absolute inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent";

/**
 * Button component supporting various visual variants, sizes, optional icons,
 * full width option, and loading state with spinner.
 * Uses forwardRef to pass ref to underlying button element.
 */
const Button = forwardRef(function Button(
  {
    children,
    className,
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    type = "button",
    ...props
  }: ButtonProps,
  // 🔹 TS: ForwardedRef type ensures correct ref typing
  ref: ForwardedRef<HTMLButtonElement>
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? fullWidthClass : undefined,
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Render left icon if provided */}
      {leftIcon ? (
        <span className="inline-flex items-center">{leftIcon}</span>
      ) : null}
      {/* Render button children, hide when loading */}
      <span className={loading ? "opacity-0" : undefined}>{children}</span>
      {/* Render right icon if provided */}
      {rightIcon ? (
        <span className="inline-flex items-center">{rightIcon}</span>
      ) : null}
      {/* Show spinner overlay when loading */}
      {loading ? <span aria-hidden className={spinnerClass} /> : null}
    </button>
  );
});

// 🔹 TS: Exporting TypeScript types
export type { ButtonProps, ButtonVariant, ButtonSize };
export { Button };
