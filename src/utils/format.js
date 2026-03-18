/**
 * 천 단위 콤마
 * @param {number} num
 * @returns {string}
 */
export function formatAmount(num) {
  return num.toLocaleString('ko-KR')
}

/**
 * YYYY-MM-DD → M월 D일
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}월 ${Number(d)}일`
}

/**
 * YYYY-MM → YYYY년 M월
 * @param {string} yearMonth
 * @returns {string}
 */
export function formatYearMonth(yearMonth) {
  const [y, m] = yearMonth.split('-')
  return `${y}년 ${Number(m)}월`
}

/**
 * Date → YYYY-MM-DD (로컬 시간 기준)
 * @param {Date} date
 * @returns {string}
 */
export function toDateStr(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Date → YYYY-MM (로컬 시간 기준)
 * @param {Date} date
 * @returns {string}
 */
export function toYearMonth(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}
