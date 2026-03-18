import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'
import { formatAmount } from '../utils/format'
import { useBudgetStore } from '../store'

/**
 * @param {{ bucket: object }} props
 */
export default function BucketCard({ bucket }) {
  const navigate = useNavigate()
  const { updateBucket } = useBudgetStore()
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(bucket.name)
  const longPressTimer = useRef(null)

  function startLongPress() {
    longPressTimer.current = setTimeout(() => {
      setNameInput(bucket.name)
      setEditing(true)
    }, 500)
  }

  function cancelLongPress() {
    clearTimeout(longPressTimer.current)
  }

  function handleCardClick() {
    if (editing) return
    navigate(`/bucket/${bucket.id}`)
  }

  function handleEditClick(e) {
    e.stopPropagation()
    setNameInput(bucket.name)
    setEditing(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = nameInput.trim()
    if (trimmed) updateBucket(bucket.id, { name: trimmed })
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div
      onClick={handleCardClick}
      onMouseDown={startLongPress}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      className="bg-white rounded-2xl p-4 cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition shadow-sm border border-gray-200"
    >
      <div className="flex justify-between items-start mb-2">
        {editing ? (
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="flex-1 flex gap-2 mr-2">
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-sm font-semibold text-gray-900 bg-gray-100 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-lg font-semibold"
            >
              확인
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setEditing(false) }}
              className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-lg font-semibold"
            >
              취소
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-1 flex-1">
            <span className="font-semibold text-gray-900">{bucket.name}</span>
            <button
              onClick={handleEditClick}
              className="p-1 text-gray-300 hover:text-gray-500 transition"
              aria-label="이름 수정"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        )}
        {!editing && bucket.rollover && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">이월</span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        ₩{formatAmount(bucket.remaining)}
      </div>
      <ProgressBar rate={bucket.usageRate} className="mb-1" />
      <div className="text-xs text-gray-400 text-right">{Math.round(bucket.usageRate)}% 사용</div>
    </div>
  )
}
