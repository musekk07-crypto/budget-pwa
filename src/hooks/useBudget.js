import { useBudgetStore } from '../store'
import { calcRemaining, calcUsageRate } from '../utils/calc'

export function useBudget() {
  const store = useBudgetStore()

  const { buckets, entries, currentYearMonth } = store

  const bucketsWithStats = buckets.map((bucket) => ({
    ...bucket,
    remaining: calcRemaining(bucket.id, currentYearMonth, entries),
    usageRate: calcUsageRate(bucket.id, currentYearMonth, entries),
    monthEntries: entries.filter(
      (e) => e.bucketId === bucket.id && e.yearMonth === currentYearMonth
    ),
  }))

  return { ...store, bucketsWithStats }
}
