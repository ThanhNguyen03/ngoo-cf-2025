const STORAGE_KEY = 'ngoo-recent-searches'
const MAX_RECENT = 10

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addRecentSearch(term: string): void {
  const trimmed = term.trim()
  if (!trimmed) return
  const existing = getRecentSearches()
  const deduplicated = [trimmed, ...existing.filter((s) => s !== trimmed)]
  const capped = deduplicated.slice(0, MAX_RECENT)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped))
  } catch {
    // localStorage unavailable (e.g. SSR)
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable
  }
}
