import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHabits } from '../hooks/useHabits'
import { Plus, Edit, Trash2, ArrowLeft, Calendar, Settings } from 'lucide-react'

export default function Habits() {
  const { habits, loading, deleteHabit, fetchHabits } = useHabits()
  const navigate = useNavigate()

  useEffect(() => {
    fetchHabits()
  }, [])

  const handleDelete = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(habitId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">My Habits</h1>
              <p className="text-gray-400 text-sm">Manage your habits</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/habits/new')}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF7B45] text-white rounded-xl transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Habit
          </button>
        </div>

        {/* Habits List */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : habits.length === 0 ? (
          <div className="bg-[#2a2a2a] rounded-2xl p-8 text-center">
            <p className="text-gray-400 mb-4">No habits yet</p>
            <button
              onClick={() => navigate('/habits/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#FF7B45] text-white rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="bg-[#2a2a2a] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{habit.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="capitalize">{habit.frequency}</span>
                      {habit.reminder_time && (
                        <span>Reminder: {habit.reminder_time}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/habits/${habit.id}/edit`)}
                      className="p-2 rounded-xl bg-[#1f1f1f] hover:bg-[#333] text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="p-2 rounded-xl bg-[#1f1f1f] hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Today</span>
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
            className="flex flex-col items-center gap-1 text-[#FF6B35]"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Habits</span>
          </button>
        </div>
      </div>
    </div>
  )
}

