import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { searchMovies } from "@/services/api";

export default function MovieAutocomplete({
  label,
  value,
  onChange,
  onSelect,
  onEnter,
  placeholder,
  disabled,
}) {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  // Skip the next search when the value changes because the user picked a result
  const skipSearchRef = useRef(false);

  // Debounced search whenever the typed value changes
  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    const query = value.trim();
    if (!query) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const data = await searchMovies(query);
        const movies = (data?.results || [])
          .filter((m) => m.poster_path)
          .slice(0, 6);
        setResults(movies);
        setOpen(movies.length > 0);
        setActiveIndex(-1);
      } catch (error) {
        console.error("Error searching movies:", error);
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Close the dropdown when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (movie) => {
    skipSearchRef.current = true;
    onChange(movie.title);
    if (onSelect) onSelect(movie);
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (open && results.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
        return;
      }
      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(results[activeIndex]);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
    }

    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  const releaseYear = (date) =>
    date ? new Date(date).getFullYear() : "";

  return (
    <div className="flex-col flex w-full gap-2" ref={containerRef}>
      {label && <p className="font-bold">{label}</p>}

      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
          className="w-full h-10 sm:h-12 py-1 px-4 rounded-sm text-white outline-gray-400 outline-1 focus:outline-3 text-sm sm:text-base bg-gray-900 disabled:opacity-50"
        />

        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500" />
          </span>
        )}

        {open && results.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full max-h-80 overflow-y-auto rounded-md bg-gray-800 border border-gray-700 shadow-xl">
            {results.map((movie, index) => (
              <li key={movie.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(movie)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 cursor-pointer transition-colors ${
                    index === activeIndex ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  <div className="relative w-10 h-15 flex-shrink-0 rounded overflow-hidden bg-gray-900">
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {movie.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {releaseYear(movie.release_date)}
                      {movie.vote_average ? (
                        <span className="ml-2 text-yellow-500">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
