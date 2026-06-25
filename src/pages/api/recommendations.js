// AI-powered movie recommendations.
// DeepSeek compares the two movies the user loves and proposes similar titles;
// TMDB then enriches each suggestion with synopsis, cast, director, poster & trailer.
import { enrichByTitle, getEnrichedMovie, searchMovieByTitle } from "@/services/tmdb";

const DEEPSEEK_API_URL =
  process.env.DEEPSEEK_API_URL || "https://api.deepseek.com";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

function buildPrompt(movie1, movie2) {
  const m1 = movie1.year ? `${movie1.title} (${movie1.year})` : movie1.title;
  const m2 = movie2.year ? `${movie2.title} (${movie2.year})` : movie2.title;

  return `A user loves these two films:
1. ${m1}
2. ${m2}

First, analyze what they have in common: themes, tone, genre, pacing, directing style, and the kind of cast/performances. Then recommend exactly 6 OTHER movies that someone who loves BOTH of these would enjoy. Do not recommend the two input films themselves, and do not recommend sequels/prequels of them unless genuinely fitting.

Respond with ONLY valid JSON in exactly this shape:
{
  "comparison": "1-2 sentence summary of the shared appeal of the two films",
  "recommendations": [
    { "title": "Exact movie title", "year": 2010, "reason": "one sentence on why a fan of both would love this" }
  ]
}`;
}

async function callDeepSeek(movie1, movie2) {
  const res = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a knowledgeable film recommendation expert. You always respond with valid JSON only, no markdown fences.",
        },
        { role: "user", content: buildPrompt(movie1, movie2) },
      ],
      response_format: { type: "json_object" },
      temperature: 1.0,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`DeepSeek API error (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || "";
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("DeepSeek returned a non-JSON response");
  }
  return parsed;
}

// Resolve an input movie to a consistent shape, preferring its TMDB id when
// the autocomplete provided one (most accurate).
async function resolveInputMovie(input) {
  if (input?.id) {
    const enriched = await getEnrichedMovie(input.id);
    if (enriched) return enriched;
  }
  if (input?.title) {
    const hit = await searchMovieByTitle(input.title, input.year);
    if (hit) return getEnrichedMovie(hit.id);
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({
      error:
        "DeepSeek API key is not configured. Add DEEPSEEK_API_KEY to your .env file and restart the server.",
    });
  }

  const { movie1, movie2 } = req.body || {};

  // Accept either { movie1: "title" } or { movie1: { id, title, year } }
  const m1Input = typeof movie1 === "string" ? { title: movie1 } : movie1;
  const m2Input = typeof movie2 === "string" ? { title: movie2 } : movie2;

  if (!m1Input?.title?.trim() || !m2Input?.title?.trim()) {
    return res.status(400).json({ error: "Please provide two movie titles" });
  }

  try {
    // Resolve both input movies on TMDB (for accurate titles/years/genres).
    const [resolved1, resolved2] = await Promise.all([
      resolveInputMovie(m1Input),
      resolveInputMovie(m2Input),
    ]);

    if (!resolved1) {
      return res.status(404).json({ error: `Could not find movie: ${m1Input.title}` });
    }
    if (!resolved2) {
      return res.status(404).json({ error: `Could not find movie: ${m2Input.title}` });
    }

    // Ask DeepSeek for similar films.
    const ai = await callDeepSeek(resolved1, resolved2);
    const suggestions = Array.isArray(ai?.recommendations)
      ? ai.recommendations
      : [];

    if (suggestions.length === 0) {
      return res.status(502).json({ error: "The AI did not return any recommendations. Try again." });
    }

    // Enrich each AI suggestion with real TMDB data (in parallel).
    const inputIds = new Set([resolved1.id, resolved2.id]);
    const enriched = await Promise.all(
      suggestions.map(async (s) => {
        const movie = await enrichByTitle(s.title, s.year);
        if (!movie) return null;
        return { ...movie, reason: s.reason || "" };
      })
    );

    // Drop misses and de-duplicate (including the two input movies).
    const seen = new Set();
    const recommendations = enriched.filter((m) => {
      if (!m || inputIds.has(m.id) || seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    return res.status(200).json({
      comparison: ai.comparison || "",
      input_movies: {
        movie1: {
          title: resolved1.title,
          year: resolved1.year,
          genres: resolved1.genres,
          poster_path: resolved1.poster_path,
        },
        movie2: {
          title: resolved2.title,
          year: resolved2.year,
          genres: resolved2.genres,
          poster_path: resolved2.poster_path,
        },
      },
      recommendations,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
