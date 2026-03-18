import { create } from 'zustand'
import {
  loadBuckets, saveBuckets,
  loadEntries, saveEntries,
  loadSettings, saveSettings,
} from './utils/storage'
import { calcRemaining } from './utils/calc'
import { toDateStr, toYearMonth } from './utils/format'

/**
 * @typedef {{ id: string, name: string, rollover: boolean, createdAt: string }} Bucket
 * @typedef {{ id: string, bucketId: string, type: 'use'|'add'|'initial'|'rollover', amount: number, date: string, memo: string, yearMonth: string }} Entry
 * @typedef {{ theme: 'light'|'dark', defaultRollover: boolean }} Settings
 */

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useBudgetStore = create((set, get) => ({
  buckets: loadBuckets(),
  entries: loadEntries(),
  settings: loadSettings(),
  currentYearMonth: toYearMonth(),

  // ── 월 이동 ──────────────────────────────────────────
  setYearMonth(ym) {
    set({ currentYearMonth: ym })
    get().applyRollovers(ym)
  },

  // ── 이월 자동 처리 ──────────────────────────────────
  applyRollovers(targetYm) {
    const { buckets, entries } = get()
    const [y, m] = targetYm.split('-').map(Number)
    const prevDate = new Date(y, m - 2, 1)
    const prevYm = toYearMonth(prevDate)

    const newEntries = [...entries]
    let changed = false

    for (const bucket of buckets) {
      if (!bucket.rollover) continue
      const alreadyExists = newEntries.some(
        (e) => e.bucketId === bucket.id && e.yearMonth === targetYm && e.type === 'rollover'
      )
      if (alreadyExists) continue

      const remaining = calcRemaining(bucket.id, prevYm, newEntries)
      if (remaining <= 0) continue

      newEntries.push({
        id: genId(),
        bucketId: bucket.id,
        type: 'rollover',
        amount: remaining,
        date: `${targetYm}-01`,
        memo: `${prevYm} 이월`,
        yearMonth: targetYm,
      })
      changed = true
    }

    if (changed) {
      saveEntries(newEntries)
      set({ entries: newEntries })
    }
  },

  // ── 버킷 ─────────────────────────────────────────────
  addBucket({ name, rollover, initialAmount }) {
    const { buckets, entries, currentYearMonth, settings } = get()
    const id = genId()
    const now = new Date().toISOString()
    const newBucket = { id, name, rollover: rollover ?? settings.defaultRollover, createdAt: now }
    const newEntry = {
      id: genId(),
      bucketId: id,
      type: 'initial',
      amount: initialAmount ?? 0,
      date: toDateStr(),
      memo: '',
      yearMonth: currentYearMonth,
    }
    const newBuckets = [...buckets, newBucket]
    const newEntries = [...entries, newEntry]
    saveBuckets(newBuckets)
    saveEntries(newEntries)
    set({ buckets: newBuckets, entries: newEntries })
  },

  updateBucket(id, patch) {
    const buckets = get().buckets.map((b) => (b.id === id ? { ...b, ...patch } : b))
    saveBuckets(buckets)
    set({ buckets })
  },

  deleteBucket(id) {
    const buckets = get().buckets.filter((b) => b.id !== id)
    const entries = get().entries.filter((e) => e.bucketId !== id)
    saveBuckets(buckets)
    saveEntries(entries)
    set({ buckets, entries })
  },

  // ── 항목 ─────────────────────────────────────────────
  addEntry({ bucketId, type, amount, date, memo }) {
    const { entries, currentYearMonth } = get()
    const ym = date ? date.slice(0, 7) : currentYearMonth
    const newEntry = {
      id: genId(),
      bucketId,
      type,
      amount,
      date: date ?? toDateStr(),
      memo: memo ?? '',
      yearMonth: ym,
    }
    const newEntries = [...entries, newEntry]
    saveEntries(newEntries)
    set({ entries: newEntries })
  },

  deleteEntry(id) {
    const entries = get().entries.filter((e) => e.id !== id)
    saveEntries(entries)
    set({ entries })
  },

  // ── 설정 ─────────────────────────────────────────────
  updateSettings(patch) {
    const settings = { ...get().settings, ...patch }
    saveSettings(settings)
    set({ settings })
  },
}))
