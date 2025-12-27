import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'

export default function Heatmap() {
  const { getCompletionsForRange } = useHabits()
  const [completions, setCompletions] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCompletions()
  }, [])

  const loadCompletions = async () => {
    setLoading(true)
    const today = new Date()
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(today.getFullYear() - 1)

    const { data } = await getCompletionsForRange(oneYearAgo, today)
    
    // Create a set of completion dates for quick lookup
    const completionSet = new Set(
      data.map(c => c.completion_date)
    )
    
    setCompletions(completionSet)
    setLoading(false)
  }

  // Generate all dates for the past year
  const generateDates = () => {
    const dates = []
    const today = new Date()
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(today.getFullYear() - 1)
    
    // Start from the first day of the week that contains oneYearAgo
    const startDate = new Date(oneYearAgo)
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek)

    const currentDate = new Date(startDate)
    const endDate = new Date(today)
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return dates
  }

  const dates = generateDates()
  const weeks = []
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7))
  }

  const getIntensity = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return completions.has(dateStr) ? 1 : 0
  }

  const getColor = (intensity) => {
    if (intensity === 0) return '#1f1f1f'
    return '#FF6B35'
  }

  if (loading) {
    return (
      <div className="bg-[#2a2a2a] rounded-2xl p-6">
        <div className="text-gray-400">Loading heatmap...</div>
      </div>
    )
  }

  const totalCompletions = completions.size
  const totalDays = dates.length
  const completionRate = totalDays > 0 ? ((totalCompletions / totalDays) * 100).toFixed(1) : 0

  return (
    <div className="bg-[#2a2a2a] rounded-2xl p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Year at a Glance</h2>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded bg-[#1f1f1f]"></div>
              <div className="w-3 h-3 rounded bg-[#FF6B35]"></div>
            </div>
            <span className="text-gray-400">More</span>
          </div>
          <div className="text-gray-400">
            {totalCompletions} days completed ({completionRate}%)
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                const intensity = getIntensity(date)
                const isToday = date.toDateString() === new Date().toDateString()
                
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-3 h-3 rounded-sm transition-all hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor: getColor(intensity),
                      border: isToday ? '1px solid #FF6B35' : 'none'
                    }}
                    title={`${date.toLocaleDateString()}: ${intensity > 0 ? 'Completed' : 'Not completed'}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <div>Mon</div>
        <div>Wed</div>
        <div>Fri</div>
        <div>Sun</div>
      </div>
    </div>
  )
}

