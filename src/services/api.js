import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";

const API_URL = process.env.NEXT_PUBLIC_MOVIE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY;

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
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

// firebase function calls
export const addToWatchlist = async (userId, movie) => {
  const ref = doc(db, "watchlists", userId);
  const snap = await getDoc(ref);

  const currentMovies = snap.exists() ? snap.data().movies || [] : [];

  const alreadyExists = currentMovies?.some((m) => m.id === movie.id);
  if (alreadyExists) return;

  const updatedMovies = [
    ...currentMovies,
    { ...movie, createdAt: new Date().toISOString() },
  ];

  await setDoc(ref, { movies: updatedMovies });
};

export const removeFromWatchlist = async (userId, movieId) => {
  const ref = doc(db, "watchlists", userId);
  const snap = await getDoc(ref);

  const currentMovies = snap.exists() ? snap.data().movies || [] : [];
  const updatedMovies = currentMovies.filter((movie) => movie.id !== movieId);

  await setDoc(ref, { movies: updatedMovies });
};

export const getWatchlist = async (userId) => {
  const ref = doc(db, "watchlists", userId);
  const snap = await getDoc(ref);

  const movies = snap.exists() ? snap.data().movies || [] : [];

  return movies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const addReview = async (movieId, review) => {
  const ref = collection(db, "reviews", String(movieId), "userReviews");
  await addDoc(ref, {
    ...review,
    createdAt: new Date().toISOString(),
  });
};

export const getReviews = async (movieId) => {
  const ref = collection(db, "reviews", String(movieId), "userReviews");
  const q = query(ref, orderBy("createdAt", "desc"), limit(10));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
