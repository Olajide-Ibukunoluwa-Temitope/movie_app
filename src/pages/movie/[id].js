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
        <div className="container px-8 pt-8 mx-auto">
          <div
            onClick={() => router.back()}
            className="flex items-center space-x-2 cursor-pointer w-fit"
          >
            <i className="ri-arrow-left-long-line text-2xl"></i>
            <span className="text-base">Back</span>
          </div>
        </div>
        <div className="container mx-auto flex p-8">
          <div className="w-1/4">
            <div className="relative h-fit w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={455}
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="w-3/4 pl-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <span className=" bg-black bg-opacity-70 px-2 py-1 rounded text-yellow-500 border border-yellow-500 font-bold text-sm">
                {movie.vote_average}
              </span>
            </div>
            <p className="text-lg text-gray-300 mb-6">{movie.tagline}</p>

            <WatchlistButton movie={movie} />

            <p className="text-lg mb-8">{movie.overview}</p>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Genres:</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre, index) => (
                  <span
                    key={genre.id}
                    className="bg-yellow-500 text-black px-3 py-1 rounded-md"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-2">
                <i className="ri-calendar-2-line text-2xl"></i>
                <span>Release date: {movie.release_date}</span>
              </div>

              <div className="flex items-center space-x-2">
                <i className="ri-time-line text-2xl"></i>
                <span>Duration: {movie.runtime} minutes</span>
              </div>

              <div className="flex items-center space-x-2">
                <i className="ri-money-dollar-circle-line text-2xl"></i>
                <span>Budget: {movie.budget.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container mx-auto mt-12">
          <div className="border-b border-gray-700">
            <nav className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-2 text-lg font-medium border-b-2 cursor-pointer ${
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
    console.log("params", params);
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
