# MovieBrowser

A responsive Next js movie application that allows users to explore movies, view details, and manage their watchlist.

## Features

- Browse popular, now playing, top rated, and upcoming movies
- View detailed information about each movie including cast, ratings, and genres
- Search functionality to find specific movies
- User authentication system
- Create and manage personal watchlists
- Add a movie review
- Responsive design works on all device sizes

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **API**: The Movie Database (TMDB) API
- **Authentication**: Firebase
- **Testing**: Playwright
- **Deployment**: Vercel

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Olajide-Ibukunoluwa-Temitope/movie_app.git
   cd movie-browser
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your TMDB API key and base api url:

   ```
   MOVIE_API_KEY=cabb51fd********69ba33a18fc9e2 (can be provided on request for the purpose of this assessment)
   NEXT_PUBLIC_MOVIE_API_URL=https://api.themoviedb.org/3

   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Testing

This project uses Playwright for end-to-end testing.

### Running Tests

```bash
# Install Playwright browsers if you haven't already
npx playwright install

# Run tests
npx playwright test

# Run tests with UI (recommended method)
npx playwright test --ui

```

## Assumptions/Reasoning

Here are some key assumptions and decisions made during development:

1. Authentication & Database

- Firebase was chosen for authentication due to its ease of setup, and ability to serve as a backend as a service since i couldn't quite find it on the TMDB API docs
- Firebase Firestore used for storing user data (watchlists, reviews) since i couldn't quite find it on the TMDB API docs
- Assumed email/password authentication would be sufficient for sign up and sign in

2. State Management

- Context API used instead of Redux since:
  - Application state wasn't too complex simple and there was no need for anything too complicated

3. Framework Choice

- Next.js was selected over plain React for:
  - Built-in routing capabilities
  - Server-side rendering benefits
  - Better performance through static optimization

4. Styling

- Tailwind CSS chosen instead of css, scss, material ui or any other one:
  - it is faster to setup and use especially with Next js

5. Testing

- Playwright for E2E testing due to:
  - Wrote a few simple test to cover the core functionalities but tests can always be more extensive

## Deployment

This project deployed on Vercel https://movie-app-swart-tau-70.vercel.app/
