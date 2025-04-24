import MovieCard from "../MovieCard";

export default function MovieRecommendations({ movie }) {
  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-300">
          Recommendations
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {movie.recommendations.results.slice(0, 8).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
