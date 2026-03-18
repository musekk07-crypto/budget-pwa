import { useState } from 'react'
import { useBudgetStore } from '../store'
import { formatYearMonth } from '../utils/format'

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

export default function MonthNav() {
  const { currentYearMonth, setYearMonth } = useBudgetStore()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(() => Number(currentYearMonth.split('-')[0]))

  function move(delta) {
    const [y, m] = currentYearMonth.split('-').map(Number)
    const d = new Date(y, m - 1 + delta, 1)
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    setYearMonth(ym)
  }

  function openPicker() {
    setPickerYear(Number(currentYearMonth.split('-')[0]))
    setPickerOpen(true)
  }

  function selectMonth(month) {
    const ym = `${pickerYear}-${String(month).padStart(2, '0')}`
    setYearMonth(ym)
    setPickerOpen(false)
  }

  const [curY, curM] = currentYearMonth.split('-').map(Number)

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => move(-1)}
          className="p-2 rounded-xl bg-white text-gray-600 hover:bg-gray-100 active:scale-95 transition border border-gray-200"
          aria-label="이전 달"
        >
          ‹
        </button>
        <button
          onClick={openPicker}
          className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition"
        >
          {formatYearMonth(currentYearMonth)}
        </button>
        <button
          onClick={() => move(1)}
          className="p-2 rounded-xl bg-white text-gray-600 hover:bg-gray-100 active:scale-95 transition border border-gray-200"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPickerOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-5 w-72">
            {/* 연도 네비 */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setPickerYear((y) => y - 1)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                aria-label="이전 연도"
              >
                ‹
              </button>
              <span className="font-bold text-gray-900">{pickerYear}년</span>
              <button
                onClick={() => setPickerYear((y) => y + 1)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                aria-label="다음 연도"
              >
                ›
              </button>
            </div>

            {/* 월 그리드 */}
            <div className="grid grid-cols-4 gap-2">
              {MONTHS.map((label, i) => {
                const month = i + 1
                const isSelected = pickerYear === curY && month === curM
                return (
                  <button
                    key={month}
                    onClick={() => selectMonth(month)}
                    className={`py-2 rounded-xl text-sm font-semibold transition active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
