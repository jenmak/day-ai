import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

export interface StoreItem {
  id: string
  createdAt: Date
  [key: string]: unknown
}

export abstract class Store<T extends StoreItem> {
  protected items: Map<string, T>
  protected storePath: string

  get(id: string): T | undefined {
    return this.items.get(id)
  }

  getAll() {
    return Array.from(this.items.values())
  }

  toModel(item: T): T {
    return item
  }

  add(item: Omit<T, "id" | "createdAt">) {
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date()
    } as T

    this.items.set(newItem.id, newItem)
    this.persist()
    return newItem
  }

  remove(id: string) {
    this.items.delete(id)
    this.persist()
    return this
  }

  update(id: string, item: Partial<T>) {
    const existingItem = this.get(id)

    if (!existingItem) {
      throw new Error("Item not found")
    }

    this.items.set(id, { ...existingItem, ...item })
    this.persist()
  }

  /**
   * --------------------------------------------------------------------------
   * Internal methods, feel free to ignore
   * --------------------------------------------------------------------------
   */

  constructor(storeName: string) {
    this.items = new Map()
    this.storePath = path.join(process.cwd(), "tmp", `${storeName}.json`)

    this.load().catch((error) => {
      console.error(`Failed to load store ${storeName}:`, error)
    })
  }

  generateId(length = 16) {
    return crypto.randomBytes(length).toString("hex")
  }

  private async persist() {
    // Skip persistence in serverless environments like Vercel
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      console.log("Skipping persistence in serverless environment")
      return
    }

    try {
      await fs.mkdir(path.dirname(this.storePath), { recursive: true })
      const serialized = JSON.stringify(Array.from(this.items.entries()))
      await fs.writeFile(this.storePath, serialized)
    } catch (error) {
      console.error("Failed to persist store:", error)
    }
  }

  protected async load() {
    // Skip loading in serverless environments like Vercel
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      console.log("Skipping store load in serverless environment")
      return
    }

    try {
      const exists = await fs
        .access(this.storePath)
        .then(() => true)
        .catch(() => false)
      if (!exists) return

      const content = await fs.readFile(this.storePath, "utf-8")
      
      // Try to parse as regular JSON first
      try {
        const entries = JSON.parse(content) as [string, T][]
        this.items = new Map(entries)
      } catch (parseError) {
        // If JSON parsing fails, the file might be corrupted or in old format
        // Clear the store and start fresh
        console.warn("Failed to parse store data, starting with empty store:", parseError)
        this.items = new Map()
        // Delete the corrupted file
        await fs.unlink(this.storePath).catch(() => {})
      }
    } catch (error) {
      console.error("Failed to load store:", error)
    }
  }
}
