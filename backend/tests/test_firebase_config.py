import pytest
from unittest.mock import patch
from backend.app.core.config import Settings
from backend.app.core import firebase


def test_settings_firebase_defaults():
    settings = Settings()
    assert hasattr(settings, "FIREBASE_PROJECT_ID")
    assert hasattr(settings, "FIREBASE_CREDENTIALS_PATH")


def test_initialize_firebase_with_missing_cert_raises():
    with patch("backend.app.core.firebase.settings.FIREBASE_CREDENTIALS_PATH", "/non/existent/path/service_account.json"):
        with patch("backend.app.core.firebase.settings.FIREBASE_PROJECT_ID", None):
            with patch("backend.app.core.firebase._firebase_app", None):
                with patch("firebase_admin.get_app", side_effect=ValueError("No app")):
                    # Should return None or raise if cert file doesn't exist
                    result = firebase.initialize_firebase()
                    assert result is None


def test_get_firebase_app_raises_when_unconfigured():
    with patch("backend.app.core.firebase._firebase_app", None):
        with patch("backend.app.core.firebase.initialize_firebase", return_value=None):
            with pytest.raises(RuntimeError, match="Firebase Admin SDK is not configured"):
                firebase.get_firebase_app()

