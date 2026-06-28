from fastapi import APIRouter

router = APIRouter()

@router.post("/view")
async def track_view():
    return {"status": "tracked"}
