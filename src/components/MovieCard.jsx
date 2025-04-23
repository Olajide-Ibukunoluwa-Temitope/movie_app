import Link from "next/link";
import Image from "next/image";

export default function MovieCard({ movie }) {
  return (
    <Link className="movie-card" href={`/movie/${movie.id}`}>
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative h-auto">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/images/placeholder_img.png"
            }
            alt={movie.title}
            width={500}
            height={500}
            priority
          />
          <span className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-yellow-500 border border-yellow-500 font-bold text-sm">
            {movie.vote_average}
          </span>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-xl font-bold mb-2 movie-title">{movie.title}</h2>
          <div className="text-gray-400 text-sm flex-grow movie-release-date">
            {movie.release_date}
          </div>
        </div>
      </div>
    </Link>
  );
}
