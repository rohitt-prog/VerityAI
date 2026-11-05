import os
import logging
from typing import Optional
import firebase_admin
from firebase_admin import credentials, firestore
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

_firebase_app: Optional[firebase_admin.App] = None
_firestore_client: Optional[firestore.firestore.Client] = None


def initialize_firebase() -> Optional[firebase_admin.App]:
    """
    Idempotently initializes the Firebase Admin SDK.
    Checks for:
    1. Existing initialized app
    2. Explicit service account JSON at settings.FIREBASE_CREDENTIALS_PATH
    3. Google Application Default Credentials
    4. Project ID fallback
    """
    global _firebase_app

    if _firebase_app is not None:
        return _firebase_app

    # Check if default app is already initialized in firebase_admin
    try:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app
    except ValueError:
        pass

    cred = None
    cred_path = settings.FIREBASE_CREDENTIALS_PATH

    if cred_path and os.path.isfile(cred_path):
        try:
            cred = credentials.Certificate(cred_path)
            logger.info("Initializing Firebase Admin with certificate from %s", cred_path)
        except Exception as e:
            logger.error("Failed to load Firebase credentials from %s: %s", cred_path, e)
            raise ValueError(f"Invalid Firebase service account credentials file: {e}") from e

    options = {}
    if settings.FIREBASE_PROJECT_ID:
        options["projectId"] = settings.FIREBASE_PROJECT_ID

    try:
        if cred:
            _firebase_app = firebase_admin.initialize_app(cred, options=options)
        elif options.get("projectId"):
            # Initializing with Application Default Credentials or Project ID
            try:
                default_cred = credentials.ApplicationDefault()
                _firebase_app = firebase_admin.initialize_app(default_cred, options=options)
            except Exception:
                _firebase_app = firebase_admin.initialize_app(options=options)
            logger.info("Initializing Firebase Admin with Project ID: %s", settings.FIREBASE_PROJECT_ID)
        else:
            logger.warning(
                "No Firebase credentials or FIREBASE_PROJECT_ID configured. "
                "Firebase features will require credentials to be set up."
            )
            return None
    except Exception as e:
        logger.error("Failed to initialize Firebase Admin SDK: %s", e)
        raise RuntimeError(f"Firebase Admin initialization failed: {e}") from e

    return _firebase_app


def get_firebase_app() -> firebase_admin.App:
    """Returns the initialized Firebase Admin App or initializes it."""
    app = initialize_firebase()
    if app is None:
        raise RuntimeError(
            "Firebase Admin SDK is not configured. Set FIREBASE_CREDENTIALS_PATH or "
            "FIREBASE_PROJECT_ID in your environment or .env file."
        )
    return app


def get_firestore_client() -> firestore.firestore.Client:
    """Returns the Firestore client instance."""
    global _firestore_client
    if _firestore_client is None:
        app = get_firebase_app()
        _firestore_client = firestore.client(app=app)
    return _firestore_client

