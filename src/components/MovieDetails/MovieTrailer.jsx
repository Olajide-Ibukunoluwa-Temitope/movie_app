import { useState } from "react";

// Pick the best available YouTube video: prefer an official Trailer,
// then any Trailer, then a Teaser, then any YouTube clip.
function getBestTrailer(videos) {
  const youtube = (videos || []).filter((v) => v.site === "YouTube");
  if (youtube.length === 0) return null;

  return (
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser") ||
    youtube[0]
  );
}

export default function MovieTrailer({ movie }) {
  const [playing, setPlaying] = useState(false);

  const trailer = getBestTrailer(movie?.videos?.results);

  // Nothing to show if the movie has no YouTube video
  if (!trailer) return null;

  const thumbnail = `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`;

  return (
    <div className="container mx-auto mt-8 sm:mt-12 px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-4 sm:mb-6">
        TRAILER
      </h2>

      <div className="relative w-full aspect-video max-w-4xl rounded-lg overflow-hidden shadow-lg bg-gray-900">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
            title={trailer.name || `${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${movie.title} trailer`}
            className="group absolute inset-0 w-full h-full cursor-pointer"
          >
            {/* YouTube thumbnail, falls back to the default hq image */}
            <img
              src={thumbnail}
              alt={`${movie.title} trailer thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-500 text-black shadow-lg group-hover:scale-110 transition-transform">
                <i className="ri-play-fill text-3xl sm:text-4xl ml-1"></i>
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
