import { Store, StoreItem } from "./Store"

export interface CacheEntry extends StoreItem {
  key: string
  value: unknown
  expiresAt: string
  ttlMinutes: number
}

export class CacheStore extends Store<CacheEntry> {
  constructor() {
    super("cache")
  }

  /**
   * Get cached value by key, checking expiration
   */
  async getCached<T>(key: string): Promise<T | null> {
    const entry = this.get(key)

    if (!entry) {
      return null
    }

    // Check if cache entry has expired
    const now = new Date()
    const expiresAt = new Date(entry.expiresAt)

    if (now > expiresAt) {
      console.log(`Cache entry expired for key: ${key}`)
      this.remove(key)
      return null
    }

    console.log(`Cache hit for key: ${key}`)
    return entry.value as T
  }

  /**
   * Set cache entry with TTL
   */
  async setCache<T>(key: string, value: T, ttlMinutes: number): Promise<void> {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000)

    const cacheEntry: Omit<CacheEntry, "id" | "createdAt"> = {
      key,
      value,
      expiresAt: expiresAt.toISOString(),
      ttlMinutes
    }

    // Check if entry already exists and update it
    const existingEntry = this.get(key)
    if (existingEntry) {
      this.update(key, cacheEntry)
    } else {
      this.add(cacheEntry)
    }

    console.log(`Cache set for key: ${key}, expires at: ${expiresAt.toISOString()}`)
  }

  /**
   * Delete cache entry by key
   */
  async deleteCache(key: string): Promise<void> {
    this.remove(key)
    console.log(`Cache deleted for key: ${key}`)
  }

  /**
   * Clear all expired cache entries
   */
  async clearExpired(): Promise<void> {
    const now = new Date()
    const expiredKeys: string[] = []

    for (const [key, entry] of this.items.entries()) {
      const expiresAt = new Date(entry.expiresAt)
      if (now > expiresAt) {
        expiredKeys.push(key)
      }
    }

    for (const key of expiredKeys) {
      this.remove(key)
    }

    if (expiredKeys.length > 0) {
      console.log(`Cleared ${expiredKeys.length} expired cache entries`)
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalEntries: number
    expiredEntries: number
    validEntries: number
    memoryUsage: string
  } {
    const now = new Date()
    let expiredCount = 0
    let validCount = 0

    for (const entry of this.items.values()) {
      const expiresAt = new Date(entry.expiresAt)
      if (now > expiresAt) {
        expiredCount++
      } else {
        validCount++
      }
    }

    const totalSize = JSON.stringify(Array.from(this.items.entries())).length
    const memoryUsage = `${(totalSize / 1024).toFixed(2)} KB`

    return {
      totalEntries: this.items.size,
      expiredEntries: expiredCount,
      validEntries: validCount,
      memoryUsage
    }
  }

  /**
   * Generate cache key with optional prefix
   */
  static generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(":")}`
  }

  /**
   * Override toModel to include cache-specific fields
   */
  toModel(item: CacheEntry) {
    return {
      id: item.id,
      createdAt: item.createdAt,
      key: item.key,
      expiresAt: item.expiresAt,
      ttlMinutes: item.ttlMinutes,
      hasValue: !!item.value
    }
  }
}
