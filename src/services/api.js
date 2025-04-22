// services/api.js
const API_URL = process.env.NEXT_PUBLIC_MOVIE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY;

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}&append_to_response=genres`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const fetchNowPlayingMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    throw error;
  }
};

export const fetchTopRatedMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    throw error;
  }
};

export const fetchUpcomingMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,recommendations`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching movie ${movieId}:`, error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};
