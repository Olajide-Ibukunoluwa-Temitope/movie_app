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
      <div className="flex justify-center items-center my-10">
        <Loader size={5} />
      </div>
    );

  return (
    <div className="container mx-auto py-12">
      <div className=" mb-6">
        <h2 className="text-3xl font-bold text-gray-300 ">Reviews</h2>
      </div>

      {reviews.length > 0 ? (
        <div className="max-h-[290px] overflow-y-auto">
          {reviews.slice(0, 10).map((review) => (
            <div
              key={review.id}
              className="mb-6 border-b border-gray-700 pb-4 review-item"
            >
              <h4 className="font-semibold text-yellow-400">
                {review.username}
              </h4>
              <p className="text-gray-300">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <h4 className="text-gray-400 text-3xl text-center my-10 no-reviews">
          No reviews yet.
        </h4>
      )}

      {user?.uid && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-2 border border-yellow-500 rounded text-white placeholder:text-gray-400 outline-none"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
