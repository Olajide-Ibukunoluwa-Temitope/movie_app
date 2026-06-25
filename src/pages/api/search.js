// Server-side proxy for TMDB movie search.
// Runs on the server so MOVIE_API_URL / MOVIE_API_KEY (non-public env vars)
// are available and the API key is never shipped to the browser.
const API_URL = process.env.MOVIE_API_URL;
const API_KEY = process.env.MOVIE_API_KEY;

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.status(200).json({ results: [] });
  }

  try {
    const response = await fetch(
      `${API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error searching movies:", error);
    return res.status(500).json({ error: "Failed to search movies" });
  }
}
