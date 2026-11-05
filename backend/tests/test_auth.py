from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from firebase_admin import auth
from backend.app.main import app

client = TestClient(app)


def test_protected_route_missing_authorization():
    response = client.get("/api/user/profile")
    assert response.status_code == 401
    assert "Missing or malformed authorization header" in response.json()["detail"]


def test_protected_route_invalid_bearer_format():
    response = client.get("/api/user/profile", headers={"Authorization": "Basic invalid123"})
    assert response.status_code == 401
    assert "Missing or malformed authorization header" in response.json()["detail"]


def test_protected_route_expired_token():
    mock_app = MagicMock()
    with patch("backend.app.core.auth.initialize_firebase", return_value=mock_app):
        with patch("firebase_admin.auth.verify_id_token", side_effect=auth.ExpiredIdTokenError("Token expired", None)):
            response = client.get("/api/user/profile", headers={"Authorization": "Bearer expired_token"})
            assert response.status_code == 401
            assert "expired" in response.json()["detail"].lower()


def test_protected_route_invalid_token():
    mock_app = MagicMock()
    with patch("backend.app.core.auth.initialize_firebase", return_value=mock_app):
        with patch("firebase_admin.auth.verify_id_token", side_effect=auth.InvalidIdTokenError("Malformed token")):
            response = client.get("/api/user/profile", headers={"Authorization": "Bearer invalid_token"})
            assert response.status_code == 401
            assert "invalid" in response.json()["detail"].lower()


def test_protected_route_missing_uid_in_token():
    mock_app = MagicMock()
    with patch("backend.app.core.auth.initialize_firebase", return_value=mock_app):
        with patch("firebase_admin.auth.verify_id_token", return_value={"email": "test@example.com"}):
            response = client.get("/api/user/profile", headers={"Authorization": "Bearer token_no_uid"})
            assert response.status_code == 401
            assert "User ID (uid) missing" in response.json()["detail"]


def test_protected_route_valid_token_success():
    mock_app = MagicMock()
    valid_payload = {"uid": "user_test_123", "email": "researcher@verity.org"}
    mock_profile = MagicMock(
        uid="user_test_123",
        email="researcher@verity.org",
        display_name="Researcher",
        role="researcher",
        created_at="2026-11-05T00:00:00Z",
        updated_at="2026-11-05T00:00:00Z",
    )
    mock_profile.model_dump.return_value = {
        "uid": "user_test_123",
        "email": "researcher@verity.org",
        "display_name": "Researcher",
        "role": "researcher",
        "created_at": "2026-11-05T00:00:00Z",
        "updated_at": "2026-11-05T00:00:00Z",
    }

    with patch("backend.app.core.auth.initialize_firebase", return_value=mock_app):
        with patch("firebase_admin.auth.verify_id_token", return_value=valid_payload):
            with patch("backend.app.services.firestore.FirestoreService.get_user_profile", return_value=mock_profile):
                response = client.get("/api/user/profile", headers={"Authorization": "Bearer valid_token_abc"})
                assert response.status_code == 200
                data = response.json()
                assert data["uid"] == "user_test_123"
                assert data["email"] == "researcher@verity.org"

