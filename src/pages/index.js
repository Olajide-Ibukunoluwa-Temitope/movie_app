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
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";

export default function Home({
  popularMoviesData,
  nowPlayingMoviesData,
  topRatedMoviesData,
  upcomingMoviesData,
  currentPage,
  category,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const tabs = ["Popular", "Now playing", "Top rated", "Upcoming"];

  const router = useRouter();
  const { query, pathname } = router;
  const data =
    category === "Popular"
      ? popularMoviesData
      : category === "Now playing"
      ? nowPlayingMoviesData
      : category === "Top rated"
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
    <div className="min-h-[calc(100vh-144px)] bg-black text-white p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="relative w-full mb-4 sm:mb-6 md:mb-8">
        <input
          type="text"
          placeholder="Search by movie title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onInput={(e) => handleSearchDebounced(e.target.value)}
          className="w-full h-10 sm:h-12 py-1 px-4 rounded-full bg-white text-gray-800 focus:outline-none text-sm sm:text-base"
        />
        <span className="absolute right-0 top-[7px] sm:top-[9px] mr-3">
          <i className="ri-search-2-line text-gray-500 text-base sm:text-lg"></i>
        </span>
      </div>

      {!searchQuery ? (
        <div>
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 md:mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer text-sm sm:text-base ${
                  category === tab
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300"
                } rounded-md`}
                onClick={() => {
                  const updatedQuery = { ...query, page: 1, category: tab };
                  router.push({
                    pathname,
                    query: updatedQuery,
                  });
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {data?.results?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {data?.results?.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col">
              <div className="text-center text-lg sm:text-xl md:text-2xl text-white mb-3">
                Movies unavailable at this time
              </div>

              <button
                onClick={() => router.back()}
                className="bg-yellow-500 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer text-sm sm:text-base"
              >
                Go back
              </button>
            </div>
          )}

          {data?.results?.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <ReactPaginate
                breakLabel="..."
                nextLabel={<i className="ri-arrow-right-s-line"></i>}
                onPageChange={(page) => {
                  const updatedQuery = { ...query, page: page.selected + 1 };

                  router.push({
                    pathname,
                    query: updatedQuery,
                  });
                }}
                pageRangeDisplayed={2}
                pageCount={data.total_pages}
                marginPagesDisplayed={1}
                forcePage={Number(currentPage) - 1}
                previousLabel={<i className="ri-arrow-left-s-line"></i>}
                renderOnZeroPageCount={null}
                containerClassName="flex flex-wrap justify-center items-center gap-1 sm:gap-2"
                pageClassName="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-gray-300 rounded-md cursor-pointer text-sm sm:text-base"
                activeClassName="bg-green-600 text-white"
                previousClassName="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-gray-300 rounded-md cursor-pointer text-sm sm:text-base"
                nextClassName="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-gray-300 rounded-md cursor-pointer text-sm sm:text-base"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          {searchResults ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {searchResults?.results?.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center text-lg sm:text-xl md:text-2xl text-white">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const page = Number(context.query.page) || 1;
    const category = context.query.category || "Popular";
    const popularData = await fetchPopularMovies(page);
    const nowPlayingData = await fetchNowPlayingMovies(page);
    const topRatedData = await fetchTopRatedMovies(page);
    const upcomingData = await fetchUpcomingMovies(page);

    return {
      props: {
        popularMoviesData: popularData,
        nowPlayingMoviesData: nowPlayingData,
        topRatedMoviesData: topRatedData,
        upcomingMoviesData: upcomingData,
        currentPage: page,
        category: category,
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
        category: "Popular",
        currentPage: 1,
        error: "Failed to load movies",
      },
    };
  }
}
