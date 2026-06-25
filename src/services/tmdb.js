// Server-side TMDB helpers (no Firebase import) used by API routes to enrich
// AI-suggested titles with real synopsis, cast, director, poster and trailer.
const API_URL = process.env.MOVIE_API_URL;
const API_KEY = process.env.MOVIE_API_KEY;

// Find a single movie by title (optionally narrowed by release year).
export async function searchMovieByTitle(title, year) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    query: title,
    include_adult: "false",
  });
  if (year) params.set("primary_release_year", String(year));

  const res = await fetch(`${API_URL}/search/movie?${params.toString()}`);
  if (!res.ok) return null;
  const data = await res.json();
  const results = data?.results || [];
  // Prefer an exact title match, otherwise fall back to the top result.
  const exact = results.find(
    (m) => m.title?.toLowerCase() === title.toLowerCase()
  );
  return exact || results[0] || null;
}

// Pull the best YouTube trailer key from a movie's videos payload.
function pickTrailerKey(videos) {
  const youtube = (videos?.results || []).filter((v) => v.site === "YouTube");
  if (youtube.length === 0) return null;
  const best =
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser") ||
    youtube[0];
  return best?.key || null;
}

// Full details for a movie id: synopsis, cast, director, poster, trailer, etc.
export async function getEnrichedMovie(movieId) {
  const res = await fetch(
    `${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
  );
  if (!res.ok) return null;
  const m = await res.json();

  const director =
    (m.credits?.crew || []).find((c) => c.job === "Director")?.name || null;
  const cast = (m.credits?.cast || []).slice(0, 5).map((c) => c.name);

  return {
    id: m.id,
    title: m.title,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    release_date: m.release_date || "",
    overview: m.overview || "",
    vote_average: m.vote_average || 0,
    genres: (m.genres || []).map((g) => g.name),
    poster_path: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : null,
    director,
    cast,
    trailerKey: pickTrailerKey(m.videos),
  };
}

// Convenience: resolve a title (+year) all the way to an enriched movie.
export async function enrichByTitle(title, year) {
  const hit = await searchMovieByTitle(title, year);
  if (!hit) return null;
  return getEnrichedMovie(hit.id);
}
