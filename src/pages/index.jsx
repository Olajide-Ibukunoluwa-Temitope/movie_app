"use client";

import { useState } from "react";
import MovieCard from "../components/MovieCard";
import {
  fetchPopularMovies,
  fetchNowPlayingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  searchMovies,
} from "../services/api";
import { debouncedFunc } from "@/helpers/debouncFunc";

export default function Home({
  popularMoviesData,
  nowPlayingMoviesData,
  topRatedMoviesData,
  upcomingMoviesData,
}) {
  const [activeTab, setActiveTab] = useState("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const tabs = ["Popular", "Now playing", "Top rated", "Upcoming"];

  const data =
    activeTab === "Popular"
      ? popularMoviesData
      : activeTab === "Now playing"
      ? nowPlayingMoviesData
      : activeTab === "Top rated"
      ? topRatedMoviesData
      : upcomingMoviesData;

  const handleSearchDebounced = debouncedFunc(async (query) => {
    if (query.trim()) {
      try {
        const results = await searchMovies(query);

        if (results.results.length > 0) {
          setSearchResults(results);
        } else {
          setSearchResults(null);
        }
      } catch (error) {
        console.error("Error searching movies:", error);
        setSearchResults(null);
      }
    }
  }, 800);

  return (
    <div className="min-h-[calc(100vh-144px)] bg-black text-white p-10">
      <div className="relative w-full mb-8">
        <input
          type="text"
          placeholder="Search by movie title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onInput={(e) => handleSearchDebounced(e.target.value)}
          className="w-full h-12 py-1 px-4 rounded-full bg-white text-gray-800 focus:outline-none"
        />
        <button className="absolute right-0 top-[9px] mr-3">
          <i className="ri-search-2-line text-gray-500 text-lg"></i>
        </button>
      </div>

      {!searchQuery ? (
        <div>
          <div className="flex mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 cursor-pointer ${
                  activeTab === tab
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300"
                } rounded-md mr-2`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {data.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {searchResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {searchResults?.results?.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center text-2xl text-white">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const popularData = await fetchPopularMovies(1);
    const nowPlayingData = await fetchNowPlayingMovies(1);
    const topRatedData = await fetchTopRatedMovies(1);
    const upcomingData = await fetchUpcomingMovies(1);

    return {
      props: {
        popularMoviesData: popularData,
        nowPlayingMoviesData: nowPlayingData,
        topRatedMoviesData: topRatedData,
        upcomingMoviesData: upcomingData,
      },
    };
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return {
      props: {
        popularMovies: [],
        nowPlayingMovies: [],
        topRatedMovies: [],
        upcomingMovies: [],
        error: "Failed to load movies",
      },
    };
  }
}
