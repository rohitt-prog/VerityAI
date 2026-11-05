from fastapi import APIRouter
from backend.app.core.config import settings
from backend.app.models.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
def get_health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        app=settings.PROJECT_NAME
    )
