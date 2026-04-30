# StreamSmart – A Smarter Streaming Experience

## Overview

StreamSmart is a movie streaming web application inspired by Netflix designed to improve content discovery through AI recommendations, social interaction, and viewing analytics.

This project was developed for a Human-Computer Interaction (CS 5063 SP2026) course and demonstrates how modern UI design and AI integration can enhance the streaming user experience.

## Features

- AI-powered movie recommendation assistant
- Social hub with reviews and activity feed
- Viewing analytics dashboard
- Smart filters for faster content discovery
- Continue watching and browsing interface
- Login page for user entry flow

## Libraries and Frameworks Used

### Core Frameworks

- React
- TypeScript
- Vite
- Node.js
- Express

### AI and Backend

- OpenAI API
- dotenv
- cors

### UI and Interaction Libraries

- Radix UI
- Lucide React
- Recharts
- Embla Carousel React
- Sonner

### Styling and Utility Libraries

- Tailwind CSS
- tailwind-merge
- clsx
- class-variance-authority

## Project Structure

```text
StreamSmart/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── MovieRow.tsx
│   │   ├── MovieGrid.tsx
│   │   ├── ContinueWatching.tsx
│   │   ├── AIChatPanel.tsx
│   │   ├── SmartFilters.tsx
│   │   ├── SocialHub.tsx
│   │   ├── ReviewsPanel.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── AchievementsPanel.tsx
│   │   ├── LoginPage.tsx
│   │   └── WatchPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── styles.css
├── server.js
├── package.json
├── package-lock.json
├── index.html
└── README.md
```

## Major Components

### LoginPage.tsx

Provides the entry screen for users before accessing the main StreamSmart interface. This creates a more realistic streaming platform flow.

### Header.tsx

Displays the main navigation and helps users move between different parts of the interface.

### HeroSection.tsx

Shows the featured movie section at the top of the homepage, similar to a streaming platform landing page.

### MovieRow.tsx and MovieGrid.tsx

Display movie content in reusable browsing layouts. These components support the main content discovery experience.

### ContinueWatching.tsx

Shows content that users can resume watching, supporting a familiar streaming interaction pattern.

### SmartFilters.tsx

Allows users to narrow content choices based on preferences and reduce time spent searching.

### AIChatPanel.tsx

Provides the AI movie assistant interface. Users can enter prompts, and the frontend sends the message to the backend server for an AI-generated response.

### SocialHub.tsx and ReviewsPanel.tsx

Support social discovery by showing friend activity, reviews, reactions, and community-style viewing signals.

### AnalyticsDashboard.tsx

Displays viewing behavior insights using sample data, such as watch habits, genre preferences, and user activity summaries.

### AchievementsPanel.tsx

Adds engagement elements by showing user achievements or progress-style summaries.

### WatchPage.tsx

Represents the viewing page where selected content can be shown as part of the prototype flow.

## Backend and AI Integration

The project includes a separate Express backend server in `server.js`.

The AI assistant follows this flow:

```text
User message
→ React AIChatPanel
→ Express backend API
→ OpenAI API
→ AI-generated movie recommendation response
→ Response displayed in the StreamSmart interface
```

The backend is used so the OpenAI API key is not directly exposed in the browser.

## How to Run the Project

### Step 1: Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

### Step 2: Start the Frontend

In Terminal 1, run:

```bash
npm run dev
```

### Step 3: Start the AI Backend

In Terminal 2, set your OpenAI API key.

For Windows PowerShell:

```powershell
$env:OPENAI_API_KEY="your_api_key_here"
```

Then start the backend server:

```bash
npm run server
```

### Step 4: Open the Application

After the frontend starts, open the local development link shown in the terminal.

Usually, the app runs at:

```text
http://localhost:5173
```

## How to Stop the Project

To stop the frontend or backend server, press:

```text
Ctrl + C
```

To remove the OpenAI API key from the current PowerShell session, run:

```powershell
Remove-Item Env:OPENAI_API_KEY
```

## Software Engineering Practices

This project demonstrates good software engineering practices through:

- Modular component-based design
- Meaningful component and file names
- Separation of frontend and backend logic
- Reusable UI components
- Organized feature-based structure
- Consistent formatting across files
- Clear division between browsing, AI, social, analytics, and authentication features

## Notes

- Movie data and analytics are simulated using mock data.
- Movie posters and banner images are loaded from public online image sources such as Unsplash.
- AI responses require a valid OpenAI API key.
- The project can be demonstrated locally or submitted through a public GitHub repository.

## Authors

- Nam Huynh
- Blake Wood
- Ryan Williams
