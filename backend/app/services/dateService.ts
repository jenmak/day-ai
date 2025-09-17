/**
 * Date utility service for consistent date handling across the application
 */
export class DateService {
  /**
   * Format a date to YYYY-MM-DD string format
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  /**
   * Parse a YYYY-MM-DD string to a Date object
   */
  static parseDate(dateString: string): Date {
    const date = new Date(dateString + 'T00:00:00.000Z')
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DD format.`)
    }
    return date
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  static getToday(): string {
    return this.formatDate(new Date())
  }

  /**
   * Get tomorrow's date in YYYY-MM-DD format
   */
  static getTomorrow(): string {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return this.formatDate(tomorrow)
  }

  /**
   * Get a date N days from today in YYYY-MM-DD format
   */
  static getDateFromToday(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return this.formatDate(date)
  }

  /**
   * Get the start of the week (Monday) for a given date
   */
  static getStartOfWeek(date: Date): Date {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)
    return startOfWeek
  }

  /**
   * Get the end of the week (Sunday) for a given date
   */
  static getEndOfWeek(date: Date): Date {
    const endOfWeek = new Date(date)
    const day = endOfWeek.getDay()
    const diff = endOfWeek.getDate() - day + 7 // Adjust when day is Sunday
    endOfWeek.setDate(diff)
    endOfWeek.setHours(23, 59, 59, 999)
    return endOfWeek
  }

  /**
   * Check if a date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date()
    return this.formatDate(date) === this.formatDate(today)
  }

  /**
   * Check if a date is tomorrow
   */
  static isTomorrow(date: Date): boolean {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return this.formatDate(date) === this.formatDate(tomorrow)
  }

  /**
   * Get the number of days between two dates
   */
  static getDaysDifference(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  /**
   * Validate that a date string is in YYYY-MM-DD format
   */
  static isValidDateFormat(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateString)) {
      return false
    }
    
    const date = new Date(dateString + 'T00:00:00.000Z')
    return !isNaN(date.getTime())
  }

  /**
   * Get a human-readable relative date string (e.g., "Today", "Tomorrow", "In 3 days")
   */
  static getRelativeDateString(date: Date): string {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayStr = this.formatDate(today)
    const tomorrowStr = this.formatDate(tomorrow)
    const dateStr = this.formatDate(date)
    
    if (dateStr === todayStr) {
      return "Today"
    } else if (dateStr === tomorrowStr) {
      return "Tomorrow"
    } else {
      const daysDiff = this.getDaysDifference(today, date)
      if (daysDiff > 0) {
        return `In ${daysDiff} day${daysDiff === 1 ? '' : 's'}`
      } else {
        return `${Math.abs(daysDiff)} day${Math.abs(daysDiff) === 1 ? '' : 's'} ago`
      }
    }
  }

  /**
   * Get a formatted date string for display (e.g., "Monday, January 15, 2024")
   */
  static getFormattedDateString(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
