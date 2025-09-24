import { CONFIG } from "../app/config"
import { CacheStore } from "./CacheStore"

/**
 * Cache management utilities for maintaining optimal cache performance
 */
export class CacheUtils {
  /**
   * Clean up expired cache entries
   */
  static async cleanupExpiredEntries(cache: CacheStore): Promise<number> {
    const statsBefore = cache.getCacheStats()
    await cache.clearExpired()
    const statsAfter = cache.getCacheStats()

    const cleaned = statsBefore.totalEntries - statsAfter.totalEntries
    console.log(`Cache cleanup: Removed ${cleaned} expired entries`)

    return cleaned
  }

  /**
   * Get cache performance metrics
   */
  static getCacheMetrics(cache: CacheStore) {
    const stats = cache.getCacheStats()
    const hitRate =
      stats.totalEntries > 0 ? ((stats.validEntries / stats.totalEntries) * 100).toFixed(2) : "0.00"

    return {
      ...stats,
      hitRate: `${hitRate}%`,
      efficiency: stats.validEntries > 0 ? "Good" : "Poor"
    }
  }

  /**
   * Preload cache with common locations
   */
  static async preloadCommonLocations(_cache: CacheStore): Promise<void> {
    const commonLocations = [
      "New York City",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose"
    ]

    console.log("Preloading cache with common locations...")

    // Note: This would require the services to be available
    // For now, just log the intention
    console.log(`Would preload cache for ${commonLocations.length} common locations`)
  }

  /**
   * Monitor cache health and log warnings if needed
   */
  static monitorCacheHealth(cache: CacheStore): void {
    const metrics = this.getCacheMetrics(cache)

    if (metrics.expiredEntries > metrics.validEntries) {
      console.warn(
        `Cache health warning: More expired entries (${metrics.expiredEntries}) than valid entries (${metrics.validEntries})`
      )
    }

    if (parseFloat(metrics.hitRate) < 50) {
      console.warn(`Cache hit rate is low: ${metrics.hitRate}`)
    }

    console.log(
      `Cache health: ${metrics.validEntries} valid, ${metrics.expiredEntries} expired, ${metrics.hitRate} hit rate`
    )
  }

  /**
   * Generate cache key for different data types
   */
  static generateCacheKeys = {
    weather: (lat: number, lng: number, startDate: string, endDate: string) =>
      CacheStore.generateKey("weather", lat.toFixed(4), lng.toFixed(4), startDate, endDate),

    geocode: (description: string) =>
      CacheStore.generateKey("geocode", description.toLowerCase().trim()),

    llm: (input: string, model?: string) =>
      CacheStore.generateKey(
        "llm",
        model || "default",
        Buffer.from(input).toString("base64").slice(0, 20)
      ),

    place: (normalizedPlace: string) =>
      CacheStore.generateKey("place", normalizedPlace.toLowerCase().trim())
  }

  /**
   * Cache TTL constants (in minutes)
   */
  static TTL = CONFIG.CACHE.TTL
}
