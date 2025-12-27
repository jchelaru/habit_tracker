// Push Notification Service
export class NotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  static async showNotification(title, options = {}) {
    const hasPermission = await this.requestPermission()
    
    if (!hasPermission) {
      console.warn('Notification permission not granted')
      return
    }

    const defaultOptions = {
      body: options.body || '',
      icon: options.icon || '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: options.tag || 'habit-reminder',
      requireInteraction: false,
      ...options
    }

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, defaultOptions)
    } catch (error) {
      // Fallback to regular notification if service worker not available
      new Notification(title, defaultOptions)
    }
  }

  static async scheduleReminder(habitName, reminderTime) {
    // Parse reminder time (HH:MM format)
    const [hours, minutes] = reminderTime.split(':').map(Number)
    const now = new Date()
    const reminderDate = new Date()
    reminderDate.setHours(hours, minutes, 0, 0)

    // If reminder time has passed today, schedule for tomorrow
    if (reminderDate < now) {
      reminderDate.setDate(reminderDate.getDate() + 1)
    }

    const delay = reminderDate.getTime() - now.getTime()

    setTimeout(() => {
      this.showNotification(`Time for ${habitName}!`, {
        body: `Don't forget to complete your habit: ${habitName}`,
        tag: `habit-${habitName}`,
        requireInteraction: true
      })
    }, delay)

    return delay
  }

  static async setupReminders(habits) {
    // Clear existing reminders (in a real app, you'd track these)
    // For now, we'll just set up new ones

    const reminders = habits
      .filter(habit => habit.reminder_time)
      .map(habit => ({
        habit,
        delay: this.scheduleReminder(habit.name, habit.reminder_time)
      }))

    return reminders
  }
}

// Background sync for offline completions
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      console.log('Service Worker registered:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

