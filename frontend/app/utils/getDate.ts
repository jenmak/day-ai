/**
 * @param date
 * @returns Date formatted as MM/DD
 */
export const getDate = (date: string) => {
  // Parse date as YYYY-MM-DD format to avoid timezone issues
  const [_, month, day] = date.split("T")[0].split("-").map(Number)
  return `${month}/${day}`
}
