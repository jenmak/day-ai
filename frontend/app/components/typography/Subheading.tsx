export function Subheading({ children, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2 className="font-medium" {...props}>
      {children}
    </h2>
  )
}
