from fastapi import APIRouter, HTTPException
import httpx
from app.config import settings

router = APIRouter()

@router.get("/stats")
async def github_stats():
    headers = {"Authorization": f"Bearer {settings.github_token}"}
    async with httpx.AsyncClient() as client:
        user = await client.get(
            f"https://api.github.com/users/{settings.github_username}",
            headers=headers,
        )
        repos = await client.get(
            f"https://api.github.com/users/{settings.github_username}/repos?per_page=100&sort=updated",
            headers=headers,
        )
    if user.status_code != 200:
        raise HTTPException(status_code=502, detail="GitHub fetch failed")

    u, r = user.json(), repos.json()
    stars = sum(repo["stargazers_count"] for repo in r)
    return {
        "followers": u["followers"],
        "public_repos": u["public_repos"],
        "total_stars": stars,
        "top_repos": sorted(r, key=lambda x: x["stargazers_count"], reverse=True)[:6],
    }
