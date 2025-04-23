import { getWatchlist } from "../services/api";

export const isInWatchlist = async (userId, movieId) => {
  const movies = await getWatchlist(userId);
  return movies.some((movie) => movie.id === movieId);
};
