import { useState } from "react";
import CastCard from "../CastCard";

export default function MovieCast({ movie }) {
  const [showAllActors, setShowAllActors] = useState(false);
  // moviecast-card
  return (
    <div className="container mx-auto mt-6 sm:mt-8 md:mt-12 py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-300">ACTORS</h2>
        <label className="inline-flex items-center cursor-pointer">
          <span className="mr-3 text-sm sm:text-base text-gray-300">
            Show all
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={showAllActors}
              onChange={() => setShowAllActors(!showAllActors)}
            />
            <div
              className={`block w-8 sm:w-10 h-5 sm:h-6 rounded-full ${
                showAllActors ? "bg-green-600" : "bg-gray-600"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-3 sm:w-4 h-3 sm:h-4 rounded-full transition-transform ${
                showAllActors ? "transform translate-x-3 sm:translate-x-4" : ""
              }`}
            ></div>
          </div>
        </label>
      </div>

      <div className="cast-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {movie.credits.cast
          .slice(0, showAllActors ? movie.credits.cast.length : 6)
          .map((actor) => (
            <CastCard key={actor.id} actor={actor} />
          ))}
      </div>
    </div>
  );
}
