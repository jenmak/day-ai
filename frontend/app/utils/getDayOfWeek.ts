/**
 * Get the day of the week for a given date
 * @param date - The date to get the day of the week for
 * @returns The day of the week
 */
export const getDayOfWeek = (date: string) => {
  // Parse date as YYYY-MM-DD format to avoid timezone issues
  const [year, month, day] = date.split('T')[0].split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)  
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const dayOfWeek = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
  })
  const todayDayOfWeek = today.toLocaleDateString('en-US', {
    weekday: 'long',
  })
  const tomorrowDayOfWeek = tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
  })
  
  if (dayOfWeek === tomorrowDayOfWeek) {
    return 'Tomorrow'
  } else if (dayOfWeek === todayDayOfWeek) {
    return 'Today'
  } else {
    return dayOfWeek
  }
}