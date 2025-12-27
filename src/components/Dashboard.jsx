import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Check, Plus, Calendar, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProgressRing from './ProgressRing'

export default function Dashboard() {
  const { getTodaysHabits, toggleCompletion } = useHabits()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [completionCount, setCompletionCount] = useState(0)
  const navigate = useNavigate()

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  useEffect(() => {
    loadTodaysHabits()
  }, [])

  const loadTodaysHabits = async () => {
    setLoading(true)
    const { data } = await getTodaysHabits()
    setHabits(data || [])
    const completed = (data || []).filter(h => h.completed).length
    setCompletionCount(completed)
    setLoading(false)
  }

  const handleToggle = async (habitId, currentStatus) => {
    const { error } = await toggleCompletion(habitId, today)
    if (!error) {
      // Optimistically update UI
      setHabits(prev => prev.map(h => 
        h.id === habitId 
          ? { ...h, completed: !currentStatus }
          : h
      ))
      setCompletionCount(prev => currentStatus ? prev - 1 : prev + 1)
    }
  }

  const totalHabits = habits.length
  const progress = totalHabits > 0 ? (completionCount / totalHabits) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Today</h1>
            <p className="text-gray-400 text-sm">{dateStr}</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Ring */}
        <div className="bg-[#2a2a2a] rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-center mb-4">
            <ProgressRing progress={progress} size={120} />
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Daily Progress</p>
            <p className="text-2xl font-bold text-white">
              {completionCount} / {totalHabits}
            </p>
            <p className="text-gray-500 text-sm mt-1">habits completed</p>
          </div>
        </div>

        {/* Habits List */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Today's Habits</h2>
            <button
              onClick={() => navigate('/habits/new')}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF7B45] text-white rounded-xl transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Habit
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="bg-[#2a2a2a] rounded-2xl p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No habits for today</p>
              <p className="text-gray-500 text-sm mb-4">Start building momentum by adding your first habit</p>
              <button
                onClick={() => navigate('/habits/new')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#FF7B45] text-white rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Habit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-[#2a2a2a] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all border border-transparent hover:border-[#333]"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggle(habit.id, habit.completed)}
                      className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        habit.completed
                          ? 'bg-[#FF6B35] text-white'
                          : 'bg-[#1f1f1f] border-2 border-[#333] text-transparent hover:border-[#FF6B35]'
                      }`}
                    >
                      {habit.completed && <Check className="w-5 h-5" />}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-medium ${habit.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {habit.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {habit.frequency === 'daily' && 'Daily'}
                        {habit.frequency === 'weekly' && 'Weekly'}
                        {habit.frequency === 'specific_days' && 'Specific days'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/habits/${habit.id}/edit`)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#2a2a2a] border-t border-[#333] px-4 py-3">
          <div className="max-w-2xl mx-auto flex justify-around">
            <button
              onClick={() => navigate('/')}
              className="flex flex-col items-center gap-1 text-[#FF6B35]"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-medium">Today</span>
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </button>
            <button
              onClick={() => navigate('/habits')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Habits</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

