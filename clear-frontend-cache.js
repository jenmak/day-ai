#!/usr/bin/env node

/**
 * Script to clear frontend localStorage cache
 * This will clear the place-store data from localStorage
 */

console.log("🧹 Clearing frontend cache...")

// This script would need to run in the browser context
// For now, we'll provide instructions for manual clearing

console.log(`
To clear the frontend cache, you have a few options:

1. **Browser Developer Tools Method:**
   - Open your browser's Developer Tools (F12)
   - Go to Application/Storage tab
   - Find "Local Storage" in the left sidebar
   - Click on your domain (localhost:3000 or your production domain)
   - Find and delete the "place-store" key
   - Refresh the page

2. **Browser Console Method:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Run: localStorage.removeItem('place-store')
   - Refresh the page

3. **Clear All Browser Data:**
   - Clear browsing data for the site
   - This will remove all localStorage data

The frontend uses Zustand with persistence to store place data in localStorage.
`)

console.log("✅ Cache clearing instructions provided!")
