import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RecommendationCard({ movie }) {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-yellow-500 transition-all">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Poster */}
        <div className="relative w-full sm:w-36 h-56 sm:h-auto flex-shrink-0 bg-gray-800">
          {movie.poster_path ? (
            <Image
              src={movie.poster_path}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 100vw, 144px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <i className="ri-film-line text-4xl"></i>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-bold" title={movie.title}>
              {movie.title}
            </h3>
            <span className="flex items-center gap-1 text-sm flex-shrink-0">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
            </span>
          </div>

          <div className="text-gray-400 text-xs sm:text-sm mt-1 space-y-0.5">
            {movie.year && <span>{movie.year}</span>}
            {movie.director && (
              <p>
                <span className="text-gray-500">Director:</span>{" "}
                {movie.director}
              </p>
            )}
            {movie.cast?.length > 0 && (
              <p className="line-clamp-1">
                <span className="text-gray-500">Cast:</span>{" "}
                {movie.cast.join(", ")}
              </p>
            )}
          </div>

          {movie.reason && (
            <p className="text-yellow-200/90 text-sm mt-2 italic">
              “{movie.reason}”
            </p>
          )}

          {movie.overview && (
            <p className="text-gray-300 text-sm mt-2 line-clamp-3">
              {movie.overview}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {movie.trailerKey && (
              <button
                type="button"
                onClick={() => setShowTrailer((s) => !s)}
                className="inline-flex items-center gap-1.5 bg-yellow-500 text-black text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-yellow-400 transition-colors cursor-pointer"
              >
                <i className="ri-play-fill text-lg"></i>
                {showTrailer ? "Hide Trailer" : "Watch Trailer"}
              </button>
            )}
            <Link
              href={`/movie/${movie.id}`}
              className="inline-flex items-center gap-1.5 bg-gray-800 text-white text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      {/* Trailer */}
      {showTrailer && movie.trailerKey && (
        <div className="relative w-full aspect-video bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&rel=0`}
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
