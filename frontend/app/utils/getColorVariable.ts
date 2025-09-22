// Extract CSS custom property name from background color class
export const getColorVariable = (bgClass: string) => {
  // Extract the CSS variable from the Tailwind class like "bg-[var(--color-cool-5)]"
  const match = bgClass.match(/var\(--color-([^)]+)\)/)
  return match ? `var(--color-${match[1]})` : 'var(--color-white)'
}
