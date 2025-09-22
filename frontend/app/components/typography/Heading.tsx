export function Heading({ children, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1 className="text-lg font-bold my-3" {...props}>
      {children}
    </h1>
  )
}