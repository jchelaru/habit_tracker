import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useHabits() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all habits for the current user
  const fetchHabits = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setHabits([])
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setHabits(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching habits:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Create a new habit
  const createHabit = async (habitData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error: createError } = await supabase
        .from('habits')
        .insert({
          ...habitData,
          user_id: user.id
        })
        .select()
        .single()

      if (createError) throw createError

      setHabits(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating habit:', err)
      return { data: null, error: err.message }
    }
  }

  // Update an existing habit
  const updateHabit = async (habitId, updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single()

      if (updateError) throw updateError

      setHabits(prev => prev.map(h => h.id === habitId ? data : h))
      return { data, error: null }
    } catch (err) {
      console.error('Error updating habit:', err)
      return { data: null, error: err.message }
    }
  }

  // Delete a habit
  const deleteHabit = async (habitId) => {
    try {
      const { error: deleteError } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)

      if (deleteError) throw deleteError

      setHabits(prev => prev.filter(h => h.id !== habitId))
      return { error: null }
    } catch (err) {
      console.error('Error deleting habit:', err)
      return { error: err.message }
    }
  }

  // Get completions for a specific date
  const getCompletionsForDate = async (date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: [], error: null }
      }

      const dateStr = date.toISOString().split('T')[0]

      const { data, error: fetchError } = await supabase
        .from('completions')
        .select('*, habits(*)')
        .eq('user_id', user.id)
        .eq('completion_date', dateStr)

      if (fetchError) throw fetchError

      return { data: data || [], error: null }
    } catch (err) {
      console.error('Error fetching completions:', err)
      return { data: [], error: err.message }
    }
  }

  // Toggle completion for a habit on a specific date
  const toggleCompletion = async (habitId, date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const dateStr = date.toISOString().split('T')[0]

      // Check if completion already exists
      const { data: existing } = await supabase
        .from('completions')
        .select('id')
        .eq('habit_id', habitId)
        .eq('completion_date', dateStr)
        .single()

      if (existing) {
        // Delete completion
        const { error: deleteError } = await supabase
          .from('completions')
          .delete()
          .eq('id', existing.id)

        if (deleteError) throw deleteError
        return { data: null, error: null }
      } else {
        // Create completion
        const { data, error: createError } = await supabase
          .from('completions')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completion_date: dateStr
          })
          .select()
          .single()

        if (createError) throw createError
        return { data, error: null }
      }
    } catch (err) {
      console.error('Error toggling completion:', err)
      return { data: null, error: err.message }
    }
  }

  // Get all completions for a date range (for heatmap)
  const getCompletionsForRange = async (startDate, endDate) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: [], error: null }
      }

      const startStr = startDate.toISOString().split('T')[0]
      const endStr = endDate.toISOString().split('T')[0]

      const { data, error: fetchError } = await supabase
        .from('completions')
        .select('completion_date, habit_id')
        .eq('user_id', user.id)
        .gte('completion_date', startStr)
        .lte('completion_date', endStr)

      if (fetchError) throw fetchError

      return { data: data || [], error: null }
    } catch (err) {
      console.error('Error fetching completions range:', err)
      return { data: [], error: err.message }
    }
  }

  // Get today's habits with completion status
  const getTodaysHabits = async () => {
    try {
      const today = new Date()
      const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: [], error: null }
      }

      // Fetch all habits
      const { data: allHabits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)

      if (habitsError) throw habitsError

      // Filter habits that should be done today
      const todaysHabits = allHabits.filter(habit => {
        if (habit.frequency === 'daily') return true
        if (habit.frequency === 'weekly') return true
        if (habit.frequency === 'specific_days') {
          return habit.days_of_week.includes(dayOfWeek)
        }
        return false
      })

      // Get completions for today
      const dateStr = today.toISOString().split('T')[0]
      const { data: completions, error: completionsError } = await supabase
        .from('completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completion_date', dateStr)

      if (completionsError) throw completionsError

      const completedHabitIds = new Set(completions.map(c => c.habit_id))

      // Combine habits with completion status
      const habitsWithStatus = todaysHabits.map(habit => ({
        ...habit,
        completed: completedHabitIds.has(habit.id)
      }))

      return { data: habitsWithStatus, error: null }
    } catch (err) {
      console.error('Error fetching today\'s habits:', err)
      return { data: [], error: err.message }
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  return {
    habits,
    loading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    getCompletionsForDate,
    toggleCompletion,
    getCompletionsForRange,
    getTodaysHabits
  }
}

