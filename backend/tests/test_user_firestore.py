from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.models.user import UserProfile, UserSessionSummary

client = TestClient(app)

AUTH_HEADER = {"Authorization": "Bearer valid_mock_token"}
MOCK_USER = {"uid": "researcher_uid_456", "email": "analyst@verity.org"}


def test_get_user_profile_endpoint():
    mock_app = MagicMock()
    mock_profile = UserProfile(
        uid="researcher_uid_456",
        email="analyst@verity.org",
        display_name="Dr. Vance",
        role="senior_analyst",
        created_at="2026-11-05T12:00:00Z",
        updated_at="2026-11-05T12:00:00Z",
    )

    with patch("backend.app.core.auth.initialize_firebase", return_value=mock_app):
        with patch("firebase_admin.auth.verify_id_token", return_value=MOCK_USER):
            with patch("backend.app.services.firestore.FirestoreService.get_user_profile", return_value=mock_profile):
                res = client.get("/api/user/profile", headers=AUTH_HEADER)
                assert res.status_code == 200
                data = res.json()
                assert data["uid"] == "researcher_uid_456"
                assert data["display_name"] == "Dr. Vance"
                assert data["role"] == "senior_analyst"


def test_update_user_profile_endpoint():
    mock_app = MagicMock()
    updated_profile = UserProfile(
        uid="researcher_uid_456",
        email="analyst@verity.org",
        display_name="Dr. Elena Vance",
        role="lead_investigator",
        created_at="2026-11-05T12:00:00Z",
        updated_at="2026-11-05T12:30:00Z",
    )

    with patch("backend.app.core.auth.initialize_firebase", return_value=mock_app):
        with patch("firebase_admin.auth.verify_id_token", return_value=MOCK_USER):
            with patch("backend.app.services.firestore.FirestoreService.upsert_user_profile", return_value=updated_profile):
                res = client.put(
                    "/api/user/profile",
                    headers=AUTH_HEADER,
                    json={"display_name": "Dr. Elena Vance", "role": "lead_investigator"},
                )
                assert res.status_code == 200
                data = res.json()
                assert data["display_name"] == "Dr. Elena Vance"
                assert data["role"] == "lead_investigator"


def test_list_and_create_user_sessions_ownership():
    mock_app = MagicMock()
    session_1 = UserSessionSummary(
        session_id="sess_001",
        user_id="researcher_uid_456",
        title="R21 Malaria Trial Efficacy",
        created_at="2026-11-05T10:00:00Z",
        claims_count=5,
    )

    with patch("backend.app.core.auth.initialize_firebase", return_value=mock_app):
        with patch("firebase_admin.auth.verify_id_token", return_value=MOCK_USER):
            with patch("backend.app.services.firestore.FirestoreService.list_user_sessions", return_value=[session_1]):
                res = client.get("/api/user/sessions", headers=AUTH_HEADER)
                assert res.status_code == 200
                sessions = res.json()
                assert len(sessions) == 1
                assert sessions[0]["session_id"] == "sess_001"
                # Strictly scoped to user's authenticated UID
                assert sessions[0]["user_id"] == "researcher_uid_456"

    # Test session creation
    new_session = UserSessionSummary(
        session_id="sess_002",
        user_id="researcher_uid_456",
        title="MOXIE Oxygen Production Milestones",
        created_at="2026-11-05T11:00:00Z",
        claims_count=3,
        is_mock=False,
    )

    with patch("backend.app.core.auth.initialize_firebase", return_value=mock_app):
        with patch("firebase_admin.auth.verify_id_token", return_value=MOCK_USER):
            with patch("backend.app.services.firestore.FirestoreService.create_user_session", return_value=new_session) as mock_create:
                res = client.post(
                    "/api/user/sessions",
                    headers=AUTH_HEADER,
                    json={"title": "MOXIE Oxygen Production Milestones", "claims_count": 3},
                )
                assert res.status_code == 201
                data = res.json()
                assert data["session_id"] == "sess_002"
                assert data["user_id"] == "researcher_uid_456"
                assert data["is_mock"] is False
                # Verify that create_user_session was called strictly with authenticated UID
                mock_create.assert_called_once_with(
                    uid="researcher_uid_456",
                    title="MOXIE Oxygen Production Milestones",
                    claims_count=3,
                    is_mock=False,
                )


def test_create_user_session_with_is_mock_flag():
    mock_app = MagicMock()
    mock_session = UserSessionSummary(
        session_id="sess_mock_003",
        user_id="researcher_uid_456",
        title="Simulated Prototype Query",
        created_at="2026-11-05T12:00:00Z",
        claims_count=2,
        is_mock=True,
    )

    with patch("backend.app.core.auth.initialize_firebase", return_value=mock_app):
        with patch("firebase_admin.auth.verify_id_token", return_value=MOCK_USER):
            with patch("backend.app.services.firestore.FirestoreService.create_user_session", return_value=mock_session) as mock_create:
                res = client.post(
                    "/api/user/sessions",
                    headers=AUTH_HEADER,
                    json={"title": "Simulated Prototype Query", "claims_count": 2, "is_mock": True},
                )
                assert res.status_code == 201
                data = res.json()
                assert data["is_mock"] is True
                mock_create.assert_called_once_with(
                    uid="researcher_uid_456",
                    title="Simulated Prototype Query",
                    claims_count=2,
                    is_mock=True,
                )


def test_user_session_summary_alias_fallback():
    # Verify model safely parses camelCase if encountering older documents
    summary = UserSessionSummary.model_validate({
        "session_id": "sess_legacy",
        "userId": "user_legacy_999",
        "title": "Legacy Session",
        "createdAt": "2026-11-01T00:00:00Z",
        "claimsCount": 4,
    })
    assert summary.user_id == "user_legacy_999"
    assert summary.created_at == "2026-11-01T00:00:00Z"
    assert summary.claims_count == 4
    assert summary.is_mock is False

