import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import Heatmap from '../components/Heatmap'

export default function Analytics() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 text-sm">Track your progress over time</p>
          </div>
        </div>

        {/* Heatmap */}
        <Heatmap />

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <div className="text-gray-400 text-sm mb-2">Current Streak</div>
            <div className="text-3xl font-bold text-white">0 days</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <div className="text-gray-400 text-sm mb-2">Longest Streak</div>
            <div className="text-3xl font-bold text-white">0 days</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <div className="text-gray-400 text-sm mb-2">Total Completions</div>
            <div className="text-3xl font-bold text-white">0</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2a2a2a] border-t border-[#333] px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-around">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Today</span>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="flex flex-col items-center gap-1 text-[#FF6B35]"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
          <button
            onClick={() => navigate('/habits')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Habits</span>
          </button>
        </div>
      </div>
    </div>
  )
}

