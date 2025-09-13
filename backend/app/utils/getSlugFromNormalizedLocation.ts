export function getSlugFromNormalizedLocation(normalizedLocation: string): string {
  return normalizedLocation
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove all non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-|-$/g, '') // Remove leading and trailing hyphens
}