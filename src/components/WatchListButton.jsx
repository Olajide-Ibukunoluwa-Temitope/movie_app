import { addToWatchlist, removeFromWatchlist } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { isInWatchlist } from "@/helpers/isWatchList";

export default function WatchlistButton({ movie }) {
  const { user } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleWatchlist = async () => {
    if (!user) return toast.error("Sign in first!");

    setIsLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(user.uid, movie.id);
        setInWatchlist(false);
      } else {
        await addToWatchlist(user.uid, movie);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkWatchlist = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const exists = await isInWatchlist(user.uid, movie.id);
          setInWatchlist(exists);
        } catch (error) {
          console.error("Error checking watchlist:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkWatchlist();
  }, [user, movie.id]);

  if (!user) return null;

  return (
    <button
      onClick={toggleWatchlist}
      className={` text-white py-2 px-4 rounded flex items-center mb-8 transition duration-300 space-x-2 cursor-pointer ${
        inWatchlist
          ? "bg-red-500 hover:bg-red-700"
          : "bg-green-500 hover:bg-green-700"
      }`}
      disabled={isLoading}
    >
      {!inWatchlist ? (
        <i className="ri-add-fill text-base"></i>
      ) : (
        <i className="ri-delete-bin-fill text-base"></i>
      )}
      <span>{inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}</span>
      {isLoading && <Loader size={4} color="white" />}
    </button>
  );
}
