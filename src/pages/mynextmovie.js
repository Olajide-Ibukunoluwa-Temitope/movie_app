import { useState } from "react";
import MovieAutocomplete from "@/components/MovieAutocomplete";
import RecommendationCard from "@/components/RecommendationCard";

export default function MynextMovie() {
  // State management
  const [movie1, setMovie1] = useState("");
  const [movie2, setMovie2] = useState("");
  // Full movie objects when picked from the autocomplete (for accurate matching)
  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState("");

  // Build the payload for one input: prefer the picked movie's id/year.
  const buildPayload = (text, selected) => {
    if (selected && selected.title === text) {
      return {
        id: selected.id,
        title: selected.title,
        year: selected.release_date
          ? Number(selected.release_date.slice(0, 4))
          : undefined,
      };
    }
    return { title: text.trim() };
  };

  // Get AI-powered recommendations from our Next.js API route
  const getRecommendations = async () => {
    if (!movie1.trim() || !movie2.trim()) {
      setError("Please enter both movie titles");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie1: buildPayload(movie1, selected1),
          movie2: buildPayload(movie2, selected2),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to get recommendations");
        console.error("Error response:", data);
        return;
      }

      setRecommendations(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong while fetching recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-144px)] bg-black text-white p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl mb-8">
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">
            Discover Your Next Favorite
          </h1>
          <p className="text-gray-400 w-[90%] text-base sm:text-lg mb-6">
            Tell us a few movies you love, and we will compare them and
            recommend similar titles you might enjoy.
          </p>
        </div>

        <div className="flex flex-col gap-5 items-start w-full">
          <p className="font-bold text-xl">Enter 2 Movies You Enjoy</p>

          {/* Movie Input 1 */}
          <MovieAutocomplete
            label="Movie #1"
            placeholder="E.g. Inception"
            value={movie1}
            onChange={setMovie1}
            onSelect={setSelected1}
            onEnter={() => !loading && getRecommendations()}
            disabled={loading}
          />

          {/* Movie Input 2 */}
          <MovieAutocomplete
            label="Movie #2"
            placeholder="E.g. The Matrix"
            value={movie2}
            onChange={setMovie2}
            onSelect={setSelected2}
            onEnter={() => !loading && getRecommendations()}
            disabled={loading}
          />

          {/* Get Recommendations Button */}
          <div className="flex w-full justify-end">
            <button
              onClick={getRecommendations}
              disabled={loading}
              className="bg-yellow-500 text-black mt-5 w-fit font-bold px-5 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Thinking...
                </span>
              ) : (
                "Get Recommendations"
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 mt-6">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <p className="mt-4 text-gray-400">
              Comparing your movies and finding the perfect matches...
            </p>
          </div>
        )}

        {/* Results Section */}
        {recommendations && !loading && (
          <div className="mt-8 space-y-6">
            {/* Input Movies Summary */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Based on your taste:</h2>
              <div className="flex gap-4 flex-wrap">
                {[
                  recommendations.input_movies.movie1,
                  recommendations.input_movies.movie2,
                ].map((m, i) => (
                  <div key={i} className="bg-gray-800 px-4 py-2 rounded">
                    <span className="font-semibold">{m.title}</span>
                    {m.genres?.length > 0 && (
                      <span className="text-gray-400 text-sm ml-2">
                        ({m.genres.join(", ")})
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {recommendations.comparison && (
                <p className="text-gray-300 mt-4 text-sm sm:text-base">
                  <span className="text-yellow-500 font-semibold">
                    Why these click:{" "}
                  </span>
                  {recommendations.comparison}
                </p>
              )}
            </div>

            {/* Recommendations List */}
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Recommended for You ({recommendations.recommendations.length})
              </h2>

              {recommendations.recommendations.length === 0 ? (
                <div className="bg-gray-900 p-8 rounded-lg text-center">
                  <p className="text-gray-400">
                    No recommendations found. Try different movies!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.recommendations.map((movie) => (
                    <RecommendationCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </div>

            {/* Try Again Button */}
            <div className="text-center pt-8">
              <button
                onClick={() => {
                  setRecommendations(null);
                  setMovie1("");
                  setMovie2("");
                  setSelected1(null);
                  setSelected2(null);
                  setError("");
                }}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Try Different Movies
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
