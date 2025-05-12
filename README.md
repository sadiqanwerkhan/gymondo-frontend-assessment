# Gymondo Frontend Assessment

This project is a fully functional **workout browser web application** built using **React + Vite**, connected to a fake backend powered by a local JSON file. It features dynamic filtering, sorting, pagination, and responsive design.

# Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Testing**: Vitest + React Testing Library
- **Backend**: Node.js (JSON-based API using Express)
- **Mock Data**: Faker.js (1000+ fake workouts)

## Features

- Global header with an image logo.
-Top bar with two filters: Start Date and Category.
- Responsive list of workouts displayed as cards.
- Maximum of 20 workouts per page.
- Other workouts can be navigated using a pagination component.
- Clicking a workout navigates to the Workout Detail Page.
- Workout Detail Page displays: name, description, start date, and category.
- Navigation back to the Workout List Page from the detail page.
- Start Date filter displays the current month and the next 12 months.
- Current month is selected by default on initial load.
- "All" option in the start date filter removes date constraints.
- Filters collapse into a toggleable section on mobile screens.
- Reset Filters button clears all selected filters.
- Paginated UI with full page numbers until 20, followed by ellipsis for longer lists.
- Total filtered and global workout counts are displayed.
- Includes unit tests using Vitest and React Testing Library RTL.

##  Setup & Installation

### 1. Clone the repository:

- bash
- git clone https://github.com/sadiqanwerkhan/gymondo-frontend-assessment.git
- cd gymondo-frontend-assessment

## Install dependencies

# For Frontend
- cd client
- npm install

## To populate the data
- cd gymondo-frontend-assessment/server
- npx ts-node src/scripts/seed.ts

## To run the project
# Frontend: 
- cd client
- npm run dev

# Backend
- cd server
- npm install
- npm run dev

## For Testing
- cd client
- npx vitest run

## Possible Improvements
- Move filter state to Context or Redux.
- Infinite scroll for workouts.
- Unit tests for filters and pagination logic.
- Deployment (Vercel/Netlify).

