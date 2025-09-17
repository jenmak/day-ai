import * as React from "react"
import { cn } from "@/lib/utils"

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallback?: string
  loading?: "lazy" | "eager"
  onError?: () => void
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, src, alt, fallback, loading = "lazy", onError, ...props }, ref) => {
    const [imgSrc, setImgSrc] = React.useState(src)
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)

    React.useEffect(() => {
      setImgSrc(src)
      setIsLoading(true)
      setHasError(false)
    }, [src])

    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
      if (fallback) {
        setImgSrc(fallback)
      }
      onError?.()
    }

    const handleLoad = () => {
      setIsLoading(false)
      setHasError(false)
    }

    return (
      <div className={cn("relative overflow-hidden", className)}>
        {isLoading && (
          <div className="absolute inset-0 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/20" />
          </div>
        )}
        <img
          ref={ref}
          src={imgSrc}
          alt={alt}
          loading={loading}
          onError={handleError}
          onLoad={handleLoad}
          className={cn(
            "transition-opacity duration-200",
            isLoading ? "opacity-0" : "opacity-100",
            hasError && fallback ? "opacity-75" : "",
            className
          )}
          {...props}
        />
        {hasError && !fallback && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="text-white/70 text-sm">Failed to load image</div>
          </div>
        )}
      </div>
    )
  }
)
Image.displayName = "Image"

export { Image }
