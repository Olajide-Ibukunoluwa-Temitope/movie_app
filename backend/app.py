TMDB_API_KEY = '1af0a26540462f3cee88ad2ed3d78e47'

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app) 

# Get API key
TMDB_API_KEY = os.environ.get('TMDB_API_KEY', '1af0a26540462f3cee88ad2ed3d78e47')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

def search_movie(title):
    """Search for a movie by title and return basic details"""
    try:
        url = f"{TMDB_BASE_URL}/search/movie"
        params = {
            'api_key': TMDB_API_KEY,
            'query': title,
            'language': 'en-US'
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        results = response.json().get('results', [])
        return results[0] if results else None
    except Exception as e:
        print(f"Error searching for movie '{title}': {e}")
        return None


def get_movie_details(movie_id):
    """Get detailed information about a movie including cast and keywords"""
    try:
        url = f"{TMDB_BASE_URL}/movie/{movie_id}"
        params = {
            'api_key': TMDB_API_KEY,
            'append_to_response': 'credits,keywords'
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error getting details for movie ID {movie_id}: {e}")
        return None


def get_similar_movies(movie_id):
    """Get similar movies from TMDB"""
    try:
        url = f"{TMDB_BASE_URL}/movie/{movie_id}/similar"
        params = {
            'api_key': TMDB_API_KEY,
            'language': 'en-US',
            'page': 1
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json().get('results', [])
    except Exception as e:
        print(f"Error getting similar movies for ID {movie_id}: {e}")
        return []


def get_recommendations_by_genre(genre_ids, exclude_ids):
    """Get popular movies by genre, excluding specified movie IDs"""
    try:
        if not genre_ids:
            return []
        
        url = f"{TMDB_BASE_URL}/discover/movie"
        params = {
            'api_key': TMDB_API_KEY,
            'with_genres': '|'.join(map(str, genre_ids)),
            'sort_by': 'vote_average.desc',
            'vote_count.gte': 1000,
            'language': 'en-US',
            'page': 1
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        results = response.json().get('results', [])
        return [m for m in results if m['id'] not in exclude_ids]
    except Exception as e:
        print(f"Error getting genre recommendations: {e}")
        return []


def calculate_movie_score(movie, target_genres, target_keywords, target_cast, target_directors):
    """
    Calculate similarity score based on multiple factors
    Higher score = better match
    """
    score = 0
    
    # Genre matching (40 points per match)
    movie_genres = [g['id'] for g in movie.get('genres', [])]
    genre_matches = len(set(movie_genres) & set(target_genres))
    score += genre_matches * 40
    
    # Keyword matching (20 points per match)
    movie_keywords = [k['id'] for k in movie.get('keywords', {}).get('keywords', [])]
    keyword_matches = len(set(movie_keywords) & set(target_keywords))
    score += keyword_matches * 20
    
    # Cast matching (20 points per match)
    movie_cast = [c['id'] for c in movie.get('credits', {}).get('cast', [])[:10]]
    cast_matches = len(set(movie_cast) & set(target_cast))
    score += cast_matches * 20
    
    # Director matching (20 points per match)
    movie_directors = [c['id'] for c in movie.get('credits', {}).get('crew', []) 
                      if c.get('job') == 'Director']
    director_matches = len(set(movie_directors) & set(target_directors))
    score += director_matches * 20
    
    # Bonus for high ratings
    if movie.get('vote_average', 0) >= 7.5:
        score += 10
    
    return score


# ============================================
# API ROUTES
# ============================================

@app.route('/', methods=['GET'])
def home():
    """Home endpoint - test if API is running"""
    return jsonify({
        'status': 'success',
        'message': 'Movie Recommendation API is running!',
        'endpoints': {
            'recommendations': 'POST /api/recommendations',
            'health': 'GET /health'
        }
    })


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})


@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """
    Main endpoint for getting movie recommendations
    Expects JSON: {"movie1": "Movie Title 1", "movie2": "Movie Title 2"}
    """
    try:
        # Get data from request
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        movie1_title = data.get('movie1', '').strip()
        movie2_title = data.get('movie2', '').strip()
        
        # Validate input
        if not movie1_title or not movie2_title:
            return jsonify({'error': 'Please provide two movie titles'}), 400
        
        print(f"\n=== Processing request ===")
        print(f"Movie 1: {movie1_title}")
        print(f"Movie 2: {movie2_title}")
        
        # Search for both movies
        movie1 = search_movie(movie1_title)
        movie2 = search_movie(movie2_title)
        
        if not movie1:
            return jsonify({'error': f'Could not find movie: {movie1_title}'}), 404
        if not movie2:
            return jsonify({'error': f'Could not find movie: {movie2_title}'}), 404
        
        print(f"Found: {movie1['title']} ({movie1.get('release_date', 'N/A')[:4]})")
        print(f"Found: {movie2['title']} ({movie2.get('release_date', 'N/A')[:4]})")
        
        # Get detailed information
        movie1_details = get_movie_details(movie1['id'])
        movie2_details = get_movie_details(movie2['id'])
        
        if not movie1_details or not movie2_details:
            return jsonify({'error': 'Could not get movie details'}), 500
        
        # Extract common features
        genres1 = [g['id'] for g in movie1_details.get('genres', [])]
        genres2 = [g['id'] for g in movie2_details.get('genres', [])]
        common_genres = list(set(genres1 + genres2))
        
        keywords1 = [k['id'] for k in movie1_details.get('keywords', {}).get('keywords', [])]
        keywords2 = [k['id'] for k in movie2_details.get('keywords', {}).get('keywords', [])]
        common_keywords = list(set(keywords1 + keywords2))
        
        cast1 = [c['id'] for c in movie1_details.get('credits', {}).get('cast', [])[:10]]
        cast2 = [c['id'] for c in movie2_details.get('credits', {}).get('cast', [])[:10]]
        common_cast = list(set(cast1 + cast2))
        
        directors1 = [c['id'] for c in movie1_details.get('credits', {}).get('crew', []) 
                     if c.get('job') == 'Director']
        directors2 = [c['id'] for c in movie2_details.get('credits', {}).get('crew', []) 
                     if c.get('job') == 'Director']
        common_directors = list(set(directors1 + directors2))
        
        print(f"Common genres: {len(common_genres)}")
        print(f"Common keywords: {len(common_keywords)}")
        
        # Get similar movies
        similar1 = get_similar_movies(movie1['id'])
        similar2 = get_similar_movies(movie2['id'])
        genre_based = get_recommendations_by_genre(common_genres, [movie1['id'], movie2['id']])
        
        # Combine and deduplicate
        all_candidates = {}
        for movie in similar1 + similar2 + genre_based:
            if movie['id'] not in [movie1['id'], movie2['id']]:
                all_candidates[movie['id']] = movie
        
        print(f"Total candidates: {len(all_candidates)}")
        
        # Score each candidate
        scored_movies = []
        for movie_id, movie in list(all_candidates.items())[:30]:  # Limit to 30 to avoid too many API calls
            details = get_movie_details(movie_id)
            if not details:
                continue
            
            score = calculate_movie_score(
                details,
                common_genres,
                common_keywords,
                common_cast,
                common_directors
            )
            
            scored_movies.append({
                'id': movie_id,
                'title': movie['title'],
                'overview': movie.get('overview', 'No description available'),
                'release_date': movie.get('release_date', ''),
                'vote_average': movie.get('vote_average', 0),
                'poster_path': f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" 
                               if movie.get('poster_path') else None,
                'score': score
            })
        
        # Sort by score and return top 10
        scored_movies.sort(key=lambda x: x['score'], reverse=True)
        recommendations = scored_movies[:10]
        
        print(f"Returning {len(recommendations)} recommendations")
        print("=== Request complete ===\n")
        
        return jsonify({
            'recommendations': recommendations,
            'input_movies': {
                'movie1': {
                    'title': movie1_details['title'],
                    'genres': [g['name'] for g in movie1_details.get('genres', [])]
                },
                'movie2': {
                    'title': movie2_details['title'],
                    'genres': [g['name'] for g in movie2_details.get('genres', [])]
                }
            }
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500


# ============================================
# START SERVER
# ============================================
if __name__ == '__main__':
    print("=" * 50)
    print("Movie Recommendation API")
    print("=" * 50)
    print(f"API Key configured: {'Yes' if TMDB_API_KEY != 'YOUR_TMDB_API_KEY_HERE' else 'No - Please add your API key!'}")
    print("Server running on: http://localhost:5000")
    print("Health check: http://localhost:5000/health")
    print("=" * 50)
    print("\nWaiting for requests...\n")
    app.run(debug=True, port=5000, host='0.0.0.0')