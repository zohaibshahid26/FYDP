import pytest
import os
import sys
from flask import Flask
from flask_jwt_extended import JWTManager

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    JWTManager(app)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers():
    return {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
    }
