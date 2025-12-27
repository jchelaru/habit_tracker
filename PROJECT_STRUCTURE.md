# Project Structure

## Complete Folder Structure

```
momentum/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard with progress ring
│   │   ├── Heatmap.jsx            # Year-at-a-glance heatmap component
│   │   └── ProgressRing.jsx       # Circular progress indicator
│   ├── hooks/
│   │   └── useHabits.js           # Custom hook for habit CRUD operations
│   ├── lib/
│   │   └── supabase.js            # Supabase client configuration
│   ├── pages/
│   │   ├── Auth.jsx               # Login/Signup page
│   │   ├── Analytics.jsx          # Analytics page with heatmap
│   │   ├── Habits.jsx             # List all habits page
│   │   └── HabitForm.jsx          # Create/Edit habit form
│   ├── services/
│   │   └── notifications.js       # Push notification service
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles with Tailwind
├── supabase-schema.sql            # Database schema for Supabase
├── vite.config.js                 # Vite config with PWA plugin
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # Setup instructions
```

## Key Files Explained

### Database Schema (`supabase-schema.sql`)
- Creates `profiles`, `habits`, and `completions` tables
- Sets up Row Level Security (RLS) policies
- Includes triggers for automatic profile creation and timestamp updates

### useHabits Hook (`src/hooks/useHabits.js`)
Provides all habit-related operations:
- `habits` - State array of all habits
- `createHabit()` - Create new habit
- `updateHabit()` - Update existing habit
- `deleteHabit()` - Delete habit
- `toggleCompletion()` - Toggle completion for a date
- `getTodaysHabits()` - Get today's habits with completion status
- `getCompletionsForRange()` - Get completions for heatmap

### Dashboard Component (`src/components/Dashboard.jsx`)
- Displays daily progress ring
- Shows list of today's habits with checkboxes
- Allows toggling completions
- Navigation to create/edit habits

### Heatmap Component (`src/components/Heatmap.jsx`)
- GitHub-style contribution graph
- Shows one year of completion history
- Color-coded by completion intensity
- Interactive tooltips

### Notification Service (`src/services/notifications.js`)
- Requests browser notification permission
- Schedules habit reminders
- Uses Web Notifications API

## Environment Variables

Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Setup Steps

1. Install dependencies: `npm install`
2. Run Supabase schema: Copy `supabase-schema.sql` to Supabase SQL Editor
3. Set environment variables in `.env`
4. Run dev server: `npm run dev`

