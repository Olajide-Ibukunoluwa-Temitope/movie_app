import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addReview, getReviews } from "@/services/api";
import { toast } from "react-toastify";
import Loader from "../Loader";

export default function MovieReviews({ movie }) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setLoading(true);
      await addReview(movie.id, {
        userId: user.uid,
        username: user.displayName || user.email,
        comment: comment.trim(),
      });
      setReviews([
        {
          userId: user.uid,
          username: user.displayName || user.email,
          comment: comment.trim(),
          createdAt: new Date(),
        },
        ...reviews,
      ]);

      toast.success("Review submitted successfully");
      setComment("");
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews(movie.id);
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
        toast.error("Failed to load reviews");
      } finally {
        setIsFetching(false);
      }
    };

    loadReviews();
  }, [movie.id]);

  if (isFetching)
    return (
      <div className="flex justify-center items-center my-6 sm:my-8 md:my-10">
        <Loader size={10} />
      </div>
    );

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-300">
          Reviews
        </h2>
      </div>

      {reviews.length > 0 ? (
        <div className="max-h-[290px] overflow-y-auto pr-2 sm:pr-4">
          {reviews.slice(0, 10).map((review) => (
            <div
              key={review.id}
              className="mb-4 sm:mb-6 border-b border-gray-700 pb-3 sm:pb-4 review-item"
            >
              <h4 className="font-semibold text-yellow-400 text-base sm:text-lg">
                {review.username}
              </h4>
              <p className="text-gray-300 text-sm sm:text-base">
                {review.comment}
              </p>
              <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <h4 className="text-gray-400 text-xl sm:text-2xl md:text-3xl text-center my-6 sm:my-8 md:my-10 no-reviews">
          No reviews yet.
        </h4>
      )}

      {user?.uid && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4 mt-6 sm:mt-8"
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-2 sm:p-3 border border-yellow-500 rounded text-white placeholder:text-gray-400 outline-none text-sm sm:text-base"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-black disabled:opacity-50 cursor-pointer text-sm sm:text-base"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
