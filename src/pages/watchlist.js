import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getWatchlist } from "../services/api";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

export default function WatchList() {
  const { user, loading } = useAuth();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const movieMap = await getWatchlist(user.uid);
          setMovies(Object.values(movieMap));
        } catch (error) {
          console.error("Error fetching watchlist:", error);
        }
        setIsLoading(false);
      }
    };

    if (!loading) fetchWatchlist();
  }, [user, loading]);
  console.log("movies", movies);
  if (loading) return <p className="p-4">Loading...</p>;

  if (!user)
    return (
      <p className="p-4 text-center">Please sign in to view your watchlist.</p>
    );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-144px)] bg-black text-white p-10">
      <h1 className="text-3xl font-bold text-gray-300 text-center mb-8">
        Watchlist
      </h1>

      {movies?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No movies in watchlist</p>
      )}
    </div>
  );
}
