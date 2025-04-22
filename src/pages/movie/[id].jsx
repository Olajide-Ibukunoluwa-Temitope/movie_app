// pages/movie/[id].js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { fetchMovieDetails, fetchPopularMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import CastCard from "@/components/CastCard";

export default function MovieDetail({ movie }) {
  const router = useRouter();
  const [showAllActors, setShowAllActors] = useState(false);

  // If page is still loading
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

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
          <Link href="/" className="flex items-center space-x-2">
            <i className="ri-arrow-left-long-line text-2xl"></i>
            <span className="text-base">Back</span>
          </Link>
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
                placeholder="blur"
                blurDataURL="/images/placeholder_img.png"
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

            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center mb-8 transition duration-300 space-x-2 cursor-pointer">
              <i className="ri-add-fill text-xl"></i>
              <span>Add to my Watchlist</span>
            </button>

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

      <section className="container mx-auto mt-12 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-300">ACTORS</h2>
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-3 text-gray-300">Show all</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={showAllActors}
                onChange={() => setShowAllActors(!showAllActors)}
              />
              <div
                className={`block w-10 h-6 rounded-full ${
                  showAllActors ? "bg-green-600" : "bg-gray-600"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  showAllActors ? "transform translate-x-4" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movie.credits.cast
            .slice(0, showAllActors ? movie.credits.cast.length : 6)
            .map((actor) => (
              <CastCard key={actor.id} actor={actor} />
            ))}
        </div>
      </section>

      <section className="container mx-auto py-12">
        <div className=" mb-6">
          <h2 className="text-3xl font-bold text-gray-300 ">Recommendations</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4  gap-6">
          {movie.recommendations.results.slice(0, 8).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

// This would be replaced with actual data fetching in a real implementation
// export async function getServerSideProps({ params }) {
//   // In a real app, you'd fetch from an API here
//   const movie = {
//     id: params.id,
//     title: "Moana 2",
//     tagline: "The ocean is calling them back.",
//     posterUrl: "/images/moana2-poster.jpg",
//     backdropUrl: "/images/moana2-backdrop.jpg",
//     rating: 7.1,
//     overview:
//       "After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and a new crew to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.",
//     genres: ["Animation", "Adventure", "Family", "Comedy"],
//     releaseDate: "20.11.2024",
//     duration: "1h 39m",
//     budget: "$150,000,000",
//     cast: [
//       {
//         name: "Auli'i Cravalho",
//         profileUrl: "/images/actors/auli-cravalho.jpg",
//       },
//       {
//         name: "Dwayne Johnson",
//         profileUrl: "/images/actors/dwayne-johnson.jpg",
//       },
//       // Add more cast members as needed
//     ],
//   };

//   return {
//     props: { movie },
//   };
// }

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
    fallback: "blocking", // Generate remaining pages on-demand
  };
}
