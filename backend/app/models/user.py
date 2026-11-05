from typing import Optional, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field, model_validator


class UserProfile(BaseModel):
    uid: str
    email: Optional[str] = None
    display_name: Optional[str] = None
    role: str = "researcher"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    role: Optional[str] = None


class UserSessionSummary(BaseModel):
    session_id: str
    user_id: str
    title: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    claims_count: int = 0
    is_mock: bool = False

    @model_validator(mode="before")
    @classmethod
    def populate_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "claimsCount" in data and "claims_count" not in data:
                data["claims_count"] = data["claimsCount"]
            if "createdAt" in data and "created_at" not in data:
                data["created_at"] = data["createdAt"]
            if "userId" in data and "user_id" not in data:
                data["user_id"] = data["userId"]
        return data


class CreateSessionRequest(BaseModel):
    title: str
    claims_count: int = 0
    is_mock: bool = False

    @model_validator(mode="before")
    @classmethod
    def populate_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "claimsCount" in data and "claims_count" not in data:
                data["claims_count"] = data["claimsCount"]
        return data

