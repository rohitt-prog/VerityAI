import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid
from backend.app.core.firebase import get_firestore_client
from backend.app.models.user import UserProfile, UserSessionSummary

logger = logging.getLogger(__name__)


class FirestoreService:
    """
    Service layer providing strictly UID-scoped Firestore operations.
    Enforces user isolation: documents are stored under /users/{uid}/...
    """

    @staticmethod
    def get_user_profile(uid: str) -> Optional[UserProfile]:
        """Fetch user profile document from /users/{uid}"""
        db = get_firestore_client()
        doc_ref = db.collection("users").document(uid)
        snapshot = doc_ref.get()

        if not snapshot.exists:
            return None

        data = snapshot.to_dict() or {}
        data["uid"] = uid
        return UserProfile(**data)

    @staticmethod
    def upsert_user_profile(
        uid: str,
        email: Optional[str] = None,
        display_name: Optional[str] = None,
        role: Optional[str] = None,
    ) -> UserProfile:
        """Create or update user profile document under /users/{uid}"""
        db = get_firestore_client()
        doc_ref = db.collection("users").document(uid)
        now_iso = datetime.now(timezone.utc).isoformat()

        snapshot = doc_ref.get()
        if snapshot.exists:
            existing = snapshot.to_dict() or {}
            update_data: Dict[str, Any] = {"updated_at": now_iso}
            if display_name is not None:
                update_data["display_name"] = display_name
            if role is not None:
                update_data["role"] = role
            if email is not None:
                update_data["email"] = email

            doc_ref.set(update_data, merge=True)
            merged = {**existing, **update_data, "uid": uid}
            return UserProfile(**merged)
        else:
            new_profile = {
                "uid": uid,
                "email": email,
                "display_name": display_name or (email.split("@")[0] if email else "Researcher"),
                "role": role or "researcher",
                "created_at": now_iso,
                "updated_at": now_iso,
            }
            doc_ref.set(new_profile)
            return UserProfile(**new_profile)

    @staticmethod
    def list_user_sessions(uid: str, limit: int = 25) -> List[UserSessionSummary]:
        """List sessions under /users/{uid}/sessions"""
        db = get_firestore_client()
        sessions_ref = (
            db.collection("users")
            .document(uid)
            .collection("sessions")
            .limit(limit)
        )

        docs = sessions_ref.stream()
        results: List[UserSessionSummary] = []
        for doc in docs:
            d = doc.to_dict()
            d["session_id"] = doc.id
            d["user_id"] = uid
            results.append(UserSessionSummary(**d))

        return results

    @staticmethod
    def create_user_session(
        uid: str,
        title: str,
        claims_count: int = 0,
        is_mock: bool = False,
    ) -> UserSessionSummary:
        """Create a new session document strictly under /users/{uid}/sessions/{session_id}"""
        db = get_firestore_client()
        session_id = f"sess_{uuid.uuid4().hex[:12]}"
        now_iso = datetime.now(timezone.utc).isoformat()

        session_data = {
            "title": title,
            "user_id": uid,
            "created_at": now_iso,
            "claims_count": claims_count,
            "is_mock": is_mock,
        }

        doc_ref = (
            db.collection("users")
            .document(uid)
            .collection("sessions")
            .document(session_id)
        )
        doc_ref.set(session_data)

        session_data["session_id"] = session_id
        return UserSessionSummary(**session_data)

