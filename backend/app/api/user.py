from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from backend.app.core.auth import get_current_user
from backend.app.models.user import UserProfile, UserProfileUpdate, UserSessionSummary, CreateSessionRequest
from backend.app.services.firestore import FirestoreService

router = APIRouter(prefix="/user", tags=["User & Firestore"])


@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: Dict[str, Any] = Depends(get_current_user)) -> UserProfile:
    """
    Get profile document for the authenticated user.
    Creates an initial profile record if it does not yet exist.
    """
    uid = current_user["uid"]
    email = current_user.get("email")

    profile = FirestoreService.get_user_profile(uid)
    if profile is None:
        profile = FirestoreService.upsert_user_profile(uid=uid, email=email)

    return profile


@router.put("/profile", response_model=UserProfile)
def update_profile(
    update_data: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> UserProfile:
    """Update profile attributes for the authenticated user."""
    uid = current_user["uid"]
    email = current_user.get("email")

    return FirestoreService.upsert_user_profile(
        uid=uid,
        email=email,
        display_name=update_data.display_name,
        role=update_data.role,
    )


@router.get("/sessions", response_model=List[UserSessionSummary])
def list_sessions(
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> List[UserSessionSummary]:
    """List all research sessions belonging exclusively to the authenticated user."""
    uid = current_user["uid"]
    return FirestoreService.list_user_sessions(uid)


@router.post("/sessions", response_model=UserSessionSummary, status_code=status.HTTP_201_CREATED)
def create_session(
    session_req: CreateSessionRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> UserSessionSummary:
    """Create a new session record scoped strictly to the authenticated user."""
    uid = current_user["uid"]
    return FirestoreService.create_user_session(
        uid=uid,
        title=session_req.title,
        claims_count=session_req.claims_count,
        is_mock=session_req.is_mock,
    )

