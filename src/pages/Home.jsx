import { useState } from 'react'
import { useBudget } from '../hooks/useBudget'
import { useBudgetStore } from '../store'
import MonthNav from '../components/MonthNav'
import BucketCard from '../components/BucketCard'

export default function Home() {
  const { bucketsWithStats } = useBudget()
  const { addBucket, settings } = useBudgetStore()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [rollover, setRollover] = useState(settings.defaultRollover)
  const [initialAmount, setInitialAmount] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    addBucket({ name: name.trim(), rollover, initialAmount: Number(initialAmount) || 0 })
    setName('')
    setInitialAmount('')
    setRollover(settings.defaultRollover)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col max-w-md mx-auto">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">예산 가계부</h1>
      </header>

      <MonthNav />

      <main className="flex-1 px-4 space-y-3 pb-32">
        {bucketsWithStats.length === 0 && !showForm && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">아직 버킷이 없어요</p>
            <p className="text-gray-400 text-sm">아래 + 버튼으로 예산 항목을 추가해 보세요</p>
          </div>
        )}
        {bucketsWithStats.map((b) => (
          <BucketCard key={b.id} bucket={b} />
        ))}

        {showForm && (
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl p-4 space-y-3 shadow-sm border border-gray-200"
          >
            <h2 className="font-bold text-gray-900">새 버킷 추가</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="버킷 이름 (예: 식비)"
              className="w-full bg-gray-100 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              required
              autoFocus
            />
            <input
              type="text"
              inputMode="decimal"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="초기 예산 금액 (선택)"
              className="w-full bg-gray-100 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rollover}
                onChange={(e) => setRollover(e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              잔여액 이월
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 font-semibold"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-white font-bold"
              >
                추가
              </button>
            </div>
          </form>
        )}
      </main>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-full text-white text-2xl font-bold shadow-lg transition active:scale-95"
          aria-label="버킷 추가"
        >
          +
        </button>
      )}
    </div>
  )
}
