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


def _level(count: int) -> int:
    if count <= 0:
        return 0
    if count < 3:
        return 1
    if count < 6:
        return 2
    if count < 10:
        return 3
    return 4


_CONTRIB_QUERY = """
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount }
        }
      }
    }
  }
}
"""


@router.get("/contributions")
async def github_contributions():
    """Real contribution calendar via the GraphQL API (needs a token)."""
    headers = {"Authorization": f"Bearer {settings.github_token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.github.com/graphql",
            headers=headers,
            json={"query": _CONTRIB_QUERY, "variables": {"login": settings.github_username}},
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="GitHub GraphQL fetch failed")

    data = resp.json()
    try:
        calendar = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]
    except (KeyError, TypeError):
        raise HTTPException(status_code=502, detail="Unexpected GitHub response")

    weeks = []
    active_weeks = 0
    peak_day = 0
    for w in calendar["weeks"]:
        days = []
        week_has = False
        for d in w["contributionDays"]:
            c = d["contributionCount"]
            if c > 0:
                week_has = True
            peak_day = max(peak_day, c)
            days.append({"date": d["date"], "count": c, "level": _level(c)})
        if week_has:
            active_weeks += 1
        weeks.append(days)

    return {
        "total": calendar["totalContributions"],
        "weeks": weeks,
        "activeWeeks": active_weeks,
        "peakDay": peak_day,
        "generated": False,
    }
