import { useState } from "react";
import CastCard from "../CastCard";

export default function MovieCast({ movie }) {
  const [showAllActors, setShowAllActors] = useState(false);

  return (
    <div className="container mx-auto mt-12 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-300">ACTORS</h2>
        <label className="inline-flex items-center cursor-pointer">
          <span className="mr-3 text-gray-300">Show all</span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={showAllActors}
              onChange={() => setShowAllActors(!showAllActors)}
            />
            <div
              className={`block w-10 h-6 rounded-full ${
                showAllActors ? "bg-green-600" : "bg-gray-600"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                showAllActors ? "transform translate-x-4" : ""
              }`}
            ></div>
          </div>
        </label>
      </div>

      <div className="cast-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movie.credits.cast
          .slice(0, showAllActors ? movie.credits.cast.length : 6)
          .map((actor) => (
            <CastCard key={actor.id} actor={actor} />
          ))}
      </div>
    </div>
  );
}
