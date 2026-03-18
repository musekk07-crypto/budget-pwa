import { useParams, useNavigate } from 'react-router-dom'
import { useBudget } from '../hooks/useBudget'
import { useBudgetStore } from '../store'
import MonthNav from '../components/MonthNav'
import BucketDetail from '../components/BucketDetail'
import ProgressBar from '../components/ProgressBar'
import { formatAmount } from '../utils/format'

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bucketsWithStats } = useBudget()
  const { deleteBucket } = useBudgetStore()

  const bucket = bucketsWithStats.find((b) => b.id === id)
  if (!bucket) return <div className="p-8 text-gray-400">버킷을 찾을 수 없습니다.</div>

  function handleDelete() {
    if (window.confirm(`"${bucket.name}" 버킷을 삭제할까요? 모든 내역도 삭제됩니다.`)) {
      deleteBucket(id)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col max-w-md mx-auto">
      <header className="px-4 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          aria-label="뒤로"
        >
          ‹
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">{bucket.name}</h1>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-rose-500 text-sm transition"
        >
          삭제
        </button>
      </header>

      <MonthNav />

      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ₩{formatAmount(bucket.remaining)}
          </div>
          <ProgressBar rate={bucket.usageRate} />
          <div className="text-xs text-gray-400 text-right mt-1">
            {Math.round(bucket.usageRate)}% 사용
          </div>
        </div>
      </div>

      <BucketDetail bucketId={id} />
    </div>
  )
}
