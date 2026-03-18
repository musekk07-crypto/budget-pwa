/**
 * 특정 버킷의 특정 월 잔여액 계산
 * @param {string} bucketId
 * @param {string} yearMonth - 'YYYY-MM'
 * @param {import('../store').Entry[]} entries
 * @returns {number}
 */
export function calcRemaining(bucketId, yearMonth, entries) {
  const monthEntries = entries.filter(
    (e) => e.bucketId === bucketId && e.yearMonth === yearMonth
  )
  let balance = 0
  for (const e of monthEntries) {
    if (e.type === 'initial' || e.type === 'add' || e.type === 'rollover') {
      balance += e.amount
    } else if (e.type === 'use') {
      balance -= e.amount
    }
  }
  return balance
}

/**
 * 사용률 계산 (0~100)
 * @param {string} bucketId
 * @param {string} yearMonth
 * @param {import('../store').Entry[]} entries
 * @returns {number}
 */
export function calcUsageRate(bucketId, yearMonth, entries) {
  const monthEntries = entries.filter(
    (e) => e.bucketId === bucketId && e.yearMonth === yearMonth
  )
  let income = 0
  let used = 0
  for (const e of monthEntries) {
    if (e.type === 'initial' || e.type === 'add' || e.type === 'rollover') {
      income += e.amount
    } else if (e.type === 'use') {
      used += e.amount
    }
  }
  if (income === 0) return 0
  return Math.min((used / income) * 100, 100)
}
