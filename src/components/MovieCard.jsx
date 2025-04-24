import Link from "next/link";
import Image from "next/image";

export default function MovieCard({ movie }) {
  return (
    <Link className="movie-card" href={`/movie/${movie.id}`}>
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative aspect-[2/3]">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/images/placeholder_img.png"
            }
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover"
            priority
          />
          <span className="absolute top-2 right-2 bg-black bg-opacity-70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-yellow-500 border border-yellow-500 font-bold text-xs sm:text-sm">
            {movie.vote_average}
          </span>
        </div>
        <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 movie-title line-clamp-2">
            {movie.title}
          </h2>
          <div className="text-gray-400 text-xs sm:text-sm movie-release-date">
            {movie.release_date}
          </div>
        </div>
      </div>
    </Link>
  );
}
