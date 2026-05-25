export function loadJson<T>(key: string, fallback: T, normalize: (value: unknown) => T): T {
  if (typeof localStorage === 'undefined') {
    return fallback
  }

  try {
    const raw = localStorage.getItem(key)

    return raw ? normalize(JSON.parse(raw)) : fallback
  } catch {
    return fallback
  }
}

export function saveJson(key: string, value: unknown): void {
  if (typeof localStorage === 'undefined') {
    return
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Local persistence is optional; quota/private-mode failures should not break the app.
  }
}

export function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

export function loadStringSet(key: string): Set<string> {
  return new Set(loadJson(key, [], normalizeStringArray))
}

export function saveStringSet(key: string, set: Set<string>): void {
  saveJson(key, Array.from(set))
}
