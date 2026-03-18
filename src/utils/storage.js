const KEYS = {
  BUCKETS: 'budget:buckets',
  ENTRIES: 'budget:entries',
  SETTINGS: 'budget:settings',
}

/**
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadBuckets() { return load(KEYS.BUCKETS, []) }
export function saveBuckets(buckets) { save(KEYS.BUCKETS, buckets) }

export function loadEntries() { return load(KEYS.ENTRIES, []) }
export function saveEntries(entries) { save(KEYS.ENTRIES, entries) }

export function loadSettings() {
  return load(KEYS.SETTINGS, { theme: 'dark', defaultRollover: false })
}
export function saveSettings(settings) { save(KEYS.SETTINGS, settings) }

/** 전체 스냅샷 내보내기 */
export function exportData() {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    buckets: loadBuckets(),
    entries: loadEntries(),
    settings: loadSettings(),
  }
}

/** 전체 스냅샷 불러오기 */
export function importData(data) {
  saveBuckets(data.buckets ?? [])
  saveEntries(data.entries ?? [])
  saveSettings(data.settings ?? { theme: 'dark', defaultRollover: false })
}
