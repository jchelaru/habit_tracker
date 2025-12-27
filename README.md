# Momentum - Habit Tracker PWA

A beautiful, modern Progressive Web App (PWA) for tracking daily habits. Built with React, Vite, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication** - Secure login/signup with Supabase Auth
- 📊 **Dashboard** - Daily view with progress ring and habit checkboxes
- 📈 **Analytics** - Year-at-a-glance heatmap (GitHub style) and completion stats
- 🎯 **Habit Management** - Create, edit, and delete habits with flexible frequency options
- ⏰ **Reminders** - Browser-based push notifications for habit reminders
- 📱 **PWA** - Installable app with offline capabilities
- 🎨 **Modern UI** - Dark theme with smooth animations

## Tech Stack

- **Frontend**: React 19, Vite 7
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **PWA**: vite-plugin-pwa
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up Supabase:**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the schema from `supabase-schema.sql`
   - Copy your project URL and anon key from Settings > API

3. **Configure environment variables:**

   Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Build for production:**

```bash
npm run build
```

## Project Structure

```
momentum/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Dashboard.jsx
│   │   ├── Heatmap.jsx
│   │   └── ProgressRing.jsx
│   ├── hooks/            # Custom React hooks
│   │   └── useHabits.js
│   ├── lib/              # Utilities and configurations
│   │   └── supabase.js
│   ├── pages/            # Page components
│   │   ├── Auth.jsx
│   │   ├── Analytics.jsx
│   │   ├── Habits.jsx
│   │   └── HabitForm.jsx
│   ├── services/         # Service modules
│   │   └── notifications.js
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── supabase-schema.sql   # Database schema
├── vite.config.js        # Vite configuration with PWA plugin
└── package.json
```

## Database Schema

The app uses three main tables:

- **profiles** - User profile information
- **habits** - Habit definitions with frequency and reminder settings
- **completions** - Daily habit completion records

See `supabase-schema.sql` for the complete schema with Row Level Security (RLS) policies.

## Key Components

### useHabits Hook

The `useHabits` hook provides all CRUD operations for habits and completions:

- `habits` - Array of all user habits
- `createHabit(habitData)` - Create a new habit
- `updateHabit(habitId, updates)` - Update an existing habit
- `deleteHabit(habitId)` - Delete a habit
- `toggleCompletion(habitId, date)` - Toggle completion for a date
- `getTodaysHabits()` - Get today's habits with completion status
- `getCompletionsForRange(startDate, endDate)` - Get completions for heatmap

### Dashboard

The main screen showing:
- Progress ring with daily completion percentage
- List of today's habits with checkboxes
- Quick navigation to create new habits

### Heatmap

GitHub-style contribution graph showing:
- One year of completion history
- Color intensity based on completion count
- Hover tooltips with dates

## Push Notifications

The app uses the Web Notifications API for habit reminders. Users will be prompted to allow notifications on first use. Reminders are scheduled based on the `reminder_time` set for each habit.

## PWA Features

- **Installable** - Add to home screen on mobile and desktop
- **Offline Support** - Service worker caches assets and API responses
- **App-like Experience** - Standalone display mode

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
