/**
 * Date utility service for consistent date handling across the application
 */
export class DateService {
  /**
   * Format a date to YYYY-MM-DD string format
   */
  static formatDate(date: Date): string {
    return date.toISOString().split("T")[0]
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  static getToday(): string {
    return this.formatDate(new Date())
  }
}
