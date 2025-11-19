import { useAuth } from "@/context/AuthContext";
import { handleLogout } from "@/services/auth";
import Link from "next/link";
import { useState } from 'react';

export default function MynextMovie() {
    // State management
    const [movie1, setMovie1] = useState('');
    const [movie2, setMovie2] = useState('');
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState(null);
    const [error, setError] = useState('');

    // Function to get recommendations from Python backend
    const getRecommendations = async () => {
        // Validate input
        if (!movie1.trim() || !movie2.trim()) {
            setError('Please enter both movie titles');
            return;
        }

        setLoading(true);
        setError('');
        setRecommendations(null);

        try {
            console.log('Sending request to backend...');
            console.log('Movie 1:', movie1);
            console.log('Movie 2:', movie2);

            // Call Python backend
            const response = await fetch('http://localhost:5000/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    movie1: movie1.trim(), 
                    movie2: movie2.trim() 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to get recommendations');
                console.error('Error response:', data);
                return;
            }

            console.log('Success! Received recommendations:', data);
            setRecommendations(data);
        } catch (err) {
            console.error('Error:', err);
            setError('Could not connect to the server. Make sure the Python backend is running on port 5000.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            getRecommendations();
        }
    };

    return (
        <div className="min-h-[calc(100vh-144px)] bg-black text-white p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center items-center">
            <div className="w-full max-w-3xl mb-8">
                <div className="flex flex-col items-center text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-300 mb-4">
                        Discover Your Next Favorite
                    </h1>
                    <p className="text-gray-400 w-[90%] text-base sm:text-lg mb-6">
                        Tell us a few movies or TV shows you love, and we'll recommend similar titles you might enjoy.
                    </p>
                </div>

                <div className="flex flex-col gap-5 items-start w-full">
                    <p className="font-bold text-xl">Enter 2 Movies You Enjoy</p>
                    
                    {/* Movie Input 1 */}
                    <div className="flex-col flex w-full gap-2">
                        <p className="font-bold">Movie/TV Show #1</p>
                        <input
                            type="text"
                            placeholder="E.g. Inception"
                            value={movie1}
                            onChange={(e) => setMovie1(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                            className="w-full h-10 sm:h-12 py-1 px-4 rounded-sm text-white outline-gray-400 outline-1 focus:outline-3 text-sm sm:text-base bg-gray-900 disabled:opacity-50"
                        />
                    </div>

                    {/* Movie Input 2 */}
                    <div className="flex-col flex w-full gap-2">
                        <p className="font-bold">Movie/TV Show #2</p>
                        <input
                            type="text"
                            placeholder="E.g. Breaking Bad"
                            value={movie2}
                            onChange={(e) => setMovie2(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                            className="w-full h-10 sm:h-12 py-1 px-4 rounded-sm text-white outline-gray-400 outline-1 focus:outline-3 text-sm sm:text-base bg-gray-900 disabled:opacity-50"
                        />
                    </div>

                    {/* Get Recommendations Button */}
                    <div className="flex w-full justify-end">
                        <button
                            onClick={getRecommendations}
                            disabled={loading}
                            className="bg-yellow-500 text-black mt-5 w-fit font-bold px-5 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                'Get Recommendations'
                            )}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12 mt-6">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                        <p className="mt-4 text-gray-400">Finding the perfect recommendations for you...</p>
                    </div>
                )}

                {/* Results Section */}
                {recommendations && !loading && (
                    <div className="mt-8 space-y-6">
                        {/* Input Movies Summary */}
                        <div className="bg-gray-900 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4">Based on your taste:</h2>
                            <div className="flex gap-4 flex-wrap">
                                <div className="bg-gray-800 px-4 py-2 rounded">
                                    <span className="font-semibold">{recommendations.input_movies.movie1.title}</span>
                                    <span className="text-gray-400 text-sm ml-2">
                                        ({recommendations.input_movies.movie1.genres.join(', ')})
                                    </span>
                                </div>
                                <div className="bg-gray-800 px-4 py-2 rounded">
                                    <span className="font-semibold">{recommendations.input_movies.movie2.title}</span>
                                    <span className="text-gray-400 text-sm ml-2">
                                        ({recommendations.input_movies.movie2.genres.join(', ')})
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations List */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                Recommended for You ({recommendations.recommendations.length})
                            </h2>
                            
                            {recommendations.recommendations.length === 0 ? (
                                <div className="bg-gray-900 p-8 rounded-lg text-center">
                                    <p className="text-gray-400">No recommendations found. Try different movies!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recommendations.recommendations.map((movie) => (
                                        <div
                                            key={movie.id}
                                            className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-yellow-500 transition-all transform hover:scale-105"
                                        >
                                            <div className="flex gap-4">
                                                {/* Movie Poster */}
                                                {movie.poster_path ? (
                                                    <img
                                                        src={movie.poster_path}
                                                        alt={movie.title}
                                                        className="w-32 h-48 object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-32 h-48 bg-gray-800 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                                
                                                {/* Movie Info */}
                                                <div className="flex-1 p-4 min-w-0">
                                                    <h3 className="text-xl font-bold mb-2 truncate" title={movie.title}>
                                                        {movie.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <div className="flex items-center">
                                                            <span className="text-yellow-500 mr-1">★</span>
                                                            <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                                                        </div>
                                                        {movie.release_date && (
                                                            <span className="text-gray-400 text-sm">
                                                                • {new Date(movie.release_date).getFullYear()}
                                                            </span>
                                                        )}
                                                        <span className="text-gray-500 text-xs">
                                                            Match: {movie.score}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm line-clamp-3">
                                                        {movie.overview}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Try Again Button */}
                        <div className="text-center pt-8">
                            <button
                                onClick={() => {
                                    setRecommendations(null);
                                    setMovie1('');
                                    setMovie2('');
                                    setError('');
                                }}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Try Different Movies
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}