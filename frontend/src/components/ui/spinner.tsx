import { cn } from "@/lib/utils"
import * as React from "react"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the spinner
   */
  size?: "sm" | "md" | "lg" | "xl"
  /**
   * Color variant of the spinner
   */
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  /**
   * Whether the spinner should be visible
   */
  show?: boolean
  /**
   * Text to display below the spinner
   */
  text?: string
  /**
   * Whether to center the spinner and text
   */
  centered?: boolean
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    { className, size = "md", variant = "default", show = true, text, centered = false, ...props },
    ref
  ) => {
    if (!show) return null

    const sizeClasses = {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-8 w-8 border-2",
      xl: "h-12 w-12 border-4"
    }

    const variantClasses = {
      default: "border-gray-300 border-t-blue-600",
      primary: "border-blue-200 border-t-blue-600",
      secondary: "border-gray-200 border-t-gray-600",
      success: "border-green-200 border-t-green-600",
      warning: "border-yellow-200 border-t-yellow-600",
      danger: "border-red-200 border-t-red-600"
    }

    const content = (
      <div className="flex flex-col items-center gap-2">
        <div
          ref={ref}
          className={cn(
            "animate-spin rounded-full border-solid",
            sizeClasses[size],
            variantClasses[variant],
            className
          )}
          {...props}
        />
        {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
      </div>
    )

    if (centered) {
      return <div className="flex items-center justify-center min-h-[200px]">{content}</div>
    }

    return content
  }
)
Spinner.displayName = "Spinner"

export { Spinner }
