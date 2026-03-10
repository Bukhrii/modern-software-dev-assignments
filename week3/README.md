# TMDB MCP Server (Week 3)

Simple Model Context Protocol (MCP) server wrapping The Movie Database (TMDB) public API. Designed for local STDIO transport and consumable by clients such as Claude Desktop.

---

## 📋 Prerequisites

- **Python 3.9+** (3.10 recommended)
- A Python virtual environment tool (`venv`, `virtualenv`, etc.)
- **TMDB API Read Access Token (v4)** – obtain from https://www.themoviedb.org/settings/api
- Dependencies listed in `requirements.txt`:
  ```
  mcp
  httpx
  ```

---

## ⚙️ Environment Setup

1. Clone the repository and change into the week3 folder:
    ```bash
    cd /home/college/ppkpl/modern-software-dev-assignments/week3
    ```
2. Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate   # Linux / macOS
    # or: venv\Scripts\activate on Windows
    ```
3. Install Python requirements:
    ```bash
    pip install -r requirements.txt
    ```
4. Export your TMDB key:
    ```bash
    export TMDB_API_KEY="your_read_access_token_here"
    ```
   (Windows PowerShell: `setx TMDB_API_KEY "your_read_access_token_here"`)

---

## 🚀 Running the Server (Local STDIO)

Start the MCP server from the `server` directory:

```bash
cd server
python app.py
```

> The process sits idle waiting on STDIO. Do **not** expect console output – communication happens via the MCP client.

### 🧪 Remote HTTP (optional / extra credit)

To run as an HTTP server, you would modify `app.py` to use `FastMCP(..., transport="http")` and expose a web endpoint. Deploying on platforms like Vercel or Cloudflare Workers is straightforward but not included in this example.

---

## 🧩 Configuring the MCP Client

### **Claude Desktop (Local STDIO example)**

1. Open or create `claude_desktop_config.json`.
2. Add an entry pointing at the Python command that launches the server. Example config (WSL users):

```json
{
  "mcpServers": {
    "tmdb_server": {
      "command": "wsl.exe",
      "args": [
        "bash",
        "-c",
        "export TMDB_API_KEY='YOUR_TOKEN' && /home/college/ppkpl/modern-software-dev-assignments/week3/venv/bin/python /home/college/ppkpl/modern-software-dev-assignments/week3/server/app.py"
      ]
    }
  }
}
```

3. Restart Claude Desktop. The server appears in the sidebar as **tmdb_server** and exposes two tools.

> 🔐 Authentication is handled by the environment variable; the client does not send the key over STDIO.

### **Agent Runtime (Remote HTTP)**

If you deploy a remote server, configure your agent's MCP settings with the base URL and (optionally) a bearer token. The token validation should follow the MCP Authorization spec.

---

## 🛠 Tool Reference

| Tool Name           | Parameters                  | Description                                                                 |
|---------------------|-----------------------------|-----------------------------------------------------------------------------|
| `search_movie`      | `query: str`                | Search TMDB by title; returns up to 5 matches with ID and release date.    |
| `get_movie_details` | `movie_id: int`             | Fetch detailed metadata (title, tagline, rating, runtime, overview).       |

### `search_movie`

- **Example input:**
  ```json
  {"query": "Inception"}
  ```
- **Example output:**
  ```text
  Hasil Pencarian:
  - Inception (ID: 27205, Rilis: 2010-07-15)
  - Inception: The Cobol Job (ID: 92841, Rilis: 2010-12-07)
  ...
  ```
- **Behavior & errors:**
  - Returns informative message if API key is missing.
  - Handles timeouts and HTTP errors gracefully.
  - Detects rate-limit (429) and advises retry later.
  - Returns "Tidak ditemukan" message when no results.

### `get_movie_details`

- **Example input:**
  ```json
  {"movie_id": 550}
  ```
- **Example output:**
  ```text
  Judul: Fight Club
  Tagline: "Mischief. Mayhem. Soap."
  Rating: 8.4/10
  Durasi: 139 menit
  Sinopsis: ...
  ```
- **Behavior & errors:**
  - 404 responses yield a friendly "film tidak ditemukan" message.
  - Same timeout/rate-limit handling as `search_movie`.
  - Returns error if API key not configured.

> All tools return plain strings; clients may parse them or display them directly.

---

## 📌 Notes

- Rate limit awareness is implemented by catching HTTP 429 and notifying the user.
- Logging is minimal; the MCP server avoids stdout for normal operation (logs can be added via standard Python logging if desired).
- Additional tooling or endpoints can be added by decorating new async functions with `@mcp.tool()`.

Feel free to expand this project with remote transport, authentication, or more TMDB endpoints!
