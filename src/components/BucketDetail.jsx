import { useState } from 'react'
import { useBudgetStore } from '../store'
import { formatAmount, formatDate } from '../utils/format'
import EntryModal from './EntryModal'

/**
 * @param {{ bucketId: string }} props
 */
const PAGE_SIZE = 5

export default function BucketDetail({ bucketId }) {
  const { entries, deleteEntry, currentYearMonth } = useBudgetStore()
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const monthEntries = entries
    .filter((e) => e.bucketId === bucketId && e.yearMonth === currentYearMonth)
    .sort((a, b) => b.date.localeCompare(a.date))

  const visibleEntries = expanded ? monthEntries : monthEntries.slice(0, PAGE_SIZE)
  const hasMore = monthEntries.length > PAGE_SIZE

  function handleDelete(id) {
    if (window.confirm('이 내역을 삭제할까요?')) deleteEntry(id)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-2 px-4 pb-4">
        {monthEntries.length === 0 && (
          <p className="text-center text-gray-400 py-12">내역이 없습니다</p>
        )}
        {visibleEntries.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between bg-white rounded-xl px-4 py-3 border ${entry.type === 'initial' ? 'border-emerald-400' : 'border-gray-200'}`}
          >
            <div>
              <div className="text-xs text-gray-400">{formatDate(entry.date)}</div>
              <div className="text-sm text-gray-800">{entry.memo || '내역'}</div>
              <div className="text-xs text-gray-400">{{ initial: '초기예산', add: '추가', use: '사용', rollover: '이월' }[entry.type]}</div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`font-bold text-base ${
                  entry.type === 'use' ? 'text-rose-500' : 'text-emerald-600'
                }`}
              >
                {entry.type === 'use' ? '-' : '+'}₩{formatAmount(entry.amount)}
              </span>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-gray-300 hover:text-rose-500 transition text-lg"
                aria-label="삭제"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
          >
            {expanded ? '접기' : `전체보기 (총 ${monthEntries.length}건)`}
          </button>
        )}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-full text-white text-2xl font-bold shadow-lg transition active:scale-95"
        aria-label="내역 추가"
      >
        +
      </button>

      {showModal && <EntryModal bucketId={bucketId} onClose={() => setShowModal(false)} />}
    </div>
  )
}
