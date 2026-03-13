import os
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("TMDB_Server")

# Konfigurasi API
TMDB_API_KEY = os.environ.get("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"
HEADERS = {
    "accept": "application/json",
    "Authorization": f"Bearer {TMDB_API_KEY}"
}

http_client = httpx.AsyncClient(headers=HEADERS, timeout=10.0)

@mcp.tool()
async def search_movie(query: str) -> str:
    """Mencari film berdasarkan judul di TMDB dan mengembalikan ID serta tahun rilisnya."""
    if not TMDB_API_KEY:
        return "Error: Konfigurasi TMDB_API_KEY belum diatur di environment variable."

    url = f"{BASE_URL}/search/movie"
    params = {"query": query, "include_adult": "false", "language": "en-US", "page": 1}

    try:
        response = await http_client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        results = data.get("results", [])
        if not results:
            return f"Tidak ditemukan film dengan judul '{query}'."

        formatted_results = [
            f"- {movie['title']} (ID: {movie['id']}, Rilis: {movie.get('release_date', 'N/A')})"
            for movie in results[:5] 
        ]
        return "Hasil Pencarian:\n" + "\n".join(formatted_results)

    except httpx.TimeoutException:
        return "Error: Permintaan ke TMDB API melebihi batas waktu (Timeout)."
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            return "Error: Terlalu banyak permintaan ke TMDB API (Rate Limit tercapai). Silakan coba lagi nanti."
        return f"Error HTTP dari TMDB: {e.response.status_code}"
    except Exception as e:
        return f"Terjadi kesalahan internal: {str(e)}"


@mcp.tool()
async def get_movie_details(movie_id: int) -> str:
    """Mendapatkan detail lengkap, sinopsis, dan rating sebuah film menggunakan ID TMDB."""
    if not TMDB_API_KEY:
        return "Error: Konfigurasi TMDB_API_KEY belum diatur."

    url = f"{BASE_URL}/movie/{movie_id}"
    params = {"language": "en-US"}

    try:
        response = await http_client.get(url, params=params)
        
        if response.status_code == 404:
            return f"Error: Film dengan ID {movie_id} tidak ditemukan."
            
        response.raise_for_status()
        movie = response.json()

        details = (
            f"Judul: {movie.get('title')}\n"
            f"Tagline: {movie.get('tagline', 'Tidak ada')}\n"
            f"Rating: {movie.get('vote_average')}/10\n"
            f"Durasi: {movie.get('runtime')} menit\n"
            f"Sinopsis: {movie.get('overview')}"
        )
        return details

    except httpx.TimeoutException:
        return "Error: Permintaan ke TMDB API melebihi batas waktu."
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            return "Error: Rate Limit TMDB tercapai. Silakan jeda sejenak."
        return f"Error HTTP: {e.response.status_code}"
    except Exception as e:
        return f"Terjadi kesalahan internal: {str(e)}"

if __name__ == "__main__":
    mcp.run()