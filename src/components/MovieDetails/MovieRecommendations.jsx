import { useState } from "react";
import MovieCard from "../MovieCard";

export default function MovieRecommendations({ movie }) {
  return (
    <div className="container mx-auto py-12">
      <div className=" mb-6">
        <h2 className="text-3xl font-bold text-gray-300 ">Recommendations</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4  gap-6">
        {movie.recommendations.results.slice(0, 8).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
