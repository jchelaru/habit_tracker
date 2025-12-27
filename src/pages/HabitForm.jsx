import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHabits } from '../hooks/useHabits'
import { ArrowLeft, Clock } from 'lucide-react'

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
]

export default function HabitForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { habits, createHabit, updateHabit, loading: habitsLoading } = useHabits()
  
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily',
    days_of_week: [],
    reminder_time: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const habit = habits.find(h => h.id === id)
      if (habit) {
        setFormData({
          name: habit.name || '',
          frequency: habit.frequency || 'daily',
          days_of_week: habit.days_of_week || [],
          reminder_time: habit.reminder_time || ''
        })
      }
    }
  }, [id, isEdit, habits])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const habitData = {
        name: formData.name,
        frequency: formData.frequency,
        reminder_time: formData.reminder_time || null,
        days_of_week: formData.frequency === 'specific_days' ? formData.days_of_week : []
      }

      if (isEdit) {
        await updateHabit(id, habitData)
      } else {
        await createHabit(habitData)
      }

      navigate('/habits')
    } catch (error) {
      console.error('Error saving habit:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleDay = (dayValue) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(dayValue)
        ? prev.days_of_week.filter(d => d !== dayValue)
        : [...prev.days_of_week, dayValue]
    }))
  }

  if (isEdit && habitsLoading) {
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
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/habits')}
            className="p-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit Habit' : 'Create New Habit'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="e.g., Morning Meditation"
              required
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Frequency
            </label>
            <div className="space-y-2">
              {['daily', 'weekly', 'specific_days'].map((freq) => (
                <label
                  key={freq}
                  className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-xl cursor-pointer hover:bg-[#333] transition-colors"
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    checked={formData.frequency === freq}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-4 h-4 text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  <span className="text-white capitalize">
                    {freq === 'specific_days' ? 'Specific Days' : freq}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Specific Days */}
          {formData.frequency === 'specific_days' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Days
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      formData.days_of_week.includes(day.value)
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333]'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reminder Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reminder Time (Optional)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="time"
                value={formData.reminder_time}
                onChange={(e) => setFormData(prev => ({ ...prev, reminder_time: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/habits')}
              className="flex-1 px-4 py-3 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-[#FF6B35] hover:bg-[#FF7B45] text-white rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Habit' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

