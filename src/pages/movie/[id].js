import { useState } from "react";
import Image from "next/image";
import { fetchMovieDetails, fetchPopularMovies } from "@/services/api";
import { useRouter } from "next/router";
import WatchlistButton from "@/components/WatchListButton";
import MovieReviews from "@/components/MovieDetails/MovieReviews";
import MovieCast from "@/components/MovieDetails/MovieCast";
import MovieRecommendations from "@/components/MovieDetails/MovieRecommendations";

export default function MovieDetail({ movie }) {
  const [activeTab, setActiveTab] = useState("actors");

  const tabs = ["Actors", "Recommendations", "Recent Reviews"];
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-144px)] bg-black text-white">
      <div
        className="w-full h-full bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
          boxShadow: "inset 0 0 0 2000px rgba(0,0,0,0.7)",
        }}
      >
        <div className="container px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 mx-auto">
          <div
            onClick={() => router.back()}
            className="flex items-center space-x-2 cursor-pointer w-fit"
            data-testid="back-button"
          >
            <i className="ri-arrow-left-long-line text-xl sm:text-2xl"></i>
            <span className="text-sm sm:text-base">Back</span>
          </div>
        </div>
        <div className="container mx-auto flex flex-col md:flex-row p-4 sm:p-6 md:p-8">
          <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
            <div className="relative aspect-[2/3] w-full max-w-xs mx-auto md:mx-0 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover"
                id="movie-poster"
                priority
              />
            </div>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4 md:pl-6 lg:pl-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {movie.title}
              </h1>
              <span
                data-testid="movie-rating"
                className="bg-black bg-opacity-70 px-2 py-1 rounded text-yellow-500 border border-yellow-500 font-bold text-sm w-fit"
              >
                {movie.vote_average}
              </span>
            </div>
            <p className="text-base sm:text-lg text-gray-300 my-4 sm:my-6">
              {movie.tagline}
            </p>

            <WatchlistButton movie={movie} />

            <p className="text-base sm:text-lg my-4 sm:my-6">
              {movie.overview}
            </p>

            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                Genres:
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre, index) => (
                  <span
                    key={genre.id}
                    data-testid="genre-tag"
                    className="bg-yellow-500 text-black px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <i className="ri-calendar-2-line text-xl sm:text-2xl"></i>
                <span className="text-sm sm:text-base movie-release-date">
                  Release date: {movie.release_date}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <i className="ri-time-line text-xl sm:text-2xl"></i>
                <span className="text-sm sm:text-base movie-runtime">
                  Duration: {movie.runtime} minutes
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <i className="ri-money-dollar-circle-line text-xl sm:text-2xl"></i>
                <span className="text-sm sm:text-base movie-budget">
                  Budget: {movie.budget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container mx-auto mt-8 sm:mt-12 px-4 sm:px-6 md:px-8">
          <div className="border-b border-gray-700">
            <nav className="flex flex-wrap gap-2 sm:gap-4 md:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-2 sm:py-4 px-2 text-base sm:text-lg font-medium border-b-2 cursor-pointer ${
                    activeTab === tab.toLowerCase()
                      ? "border-yellow-500 text-yellow-500"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {activeTab === "actors" && <MovieCast movie={movie} />}

      {activeTab === "recommendations" && (
        <MovieRecommendations movie={movie} />
      )}

      {activeTab === "recent reviews" && <MovieReviews movie={movie} />}
    </div>
  );
}

export async function getStaticProps({ params }) {
  try {
    const movieData = await fetchMovieDetails(params.id);

    if (!movieData) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        movie: movieData,
      },
      revalidate: 3600, // Regenerate page every hour
    };
  } catch (error) {
    console.error(`Failed to fetch movie ${params.id}:`, error);
    return {
      props: {
        movie: null,
        error: "Failed to load movie details",
      },
      revalidate: 3600, // Try again after an hour if failed
    };
  }
}

export async function getStaticPaths() {
  // Pre-render only the most popular movies
  const data = await fetchPopularMovies(1);

  const paths = data.results.map((movie) => ({
    params: { id: movie.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}
