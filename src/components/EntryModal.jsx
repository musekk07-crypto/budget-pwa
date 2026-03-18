import { useState, useEffect } from 'react'
import { useBudgetStore } from '../store'
import { formatAmount } from '../utils/format'

/**
 * @param {{ bucketId: string, onClose: () => void }} props
 */
export default function EntryModal({ bucketId, onClose }) {
  const { addEntry, currentYearMonth } = useBudgetStore()
  const [type, setType] = useState('use')
  const [amountStr, setAmountStr] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [memo, setMemo] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleAmountChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setAmountStr(raw)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const amount = Number(amountStr)
    if (!amount || amount <= 0) return
    addEntry({ bucketId, type, amount, date, memo })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl p-6 pb-10 safe-bottom">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
        <h2 className="text-lg font-bold text-gray-900 mb-4">내역 추가</h2>

        <div className="flex gap-2 mb-4">
          {['use', 'add'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-xl font-semibold transition ${
                type === t
                  ? t === 'use' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {t === 'use' ? '지출' : '수입/추가'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">금액</label>
            <input
              type="text"
              inputMode="decimal"
              value={amountStr ? formatAmount(Number(amountStr)) : ''}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full bg-gray-100 text-gray-900 text-xl font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">메모 (선택)</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요"
              className="w-full bg-gray-100 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white font-bold rounded-xl transition mt-2"
          >
            저장
          </button>
        </form>
      </div>
    </div>
  )
}
