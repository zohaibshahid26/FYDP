"""
Authentication routes for user management
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required, create_access_token,
    get_jwt_identity, get_jwt
)
from modules.auth_service import AuthService

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate user data
    errors = AuthService.validate_registration_data(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400
    
    # Register user
    user = AuthService.register_user(data)
    return jsonify({"success": True, "user": user}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Log in a user and return tokens"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"success": False, "message": "Email and password are required"}), 400
    
    # Authenticate user
    result = AuthService.login_user(data['email'], data['password'])
    if not result:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401
    
    return jsonify({"success": True, **result}), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    identity = get_jwt_identity()
    user = AuthService.get_user_by_id(identity)
    
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    # Create new access token
    access_token = create_access_token(
        identity=identity,
        additional_claims={"name": user['name'], "email": user['email'], "role": user.get('role', 'user')}
    )
    
    return jsonify({"success": True, "access_token": access_token}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    """Get current user's profile"""
    identity = get_jwt_identity()
    user = AuthService.get_user_by_id(identity)
    
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    return jsonify({"success": True, "user": user}), 200

@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_user():
    """Update current user's profile"""
    identity = get_jwt_identity()
    data = request.get_json()
    
    success = AuthService.update_user(identity, data)
    if not success:
        return jsonify({"success": False, "message": "Failed to update user"}), 400
    
    # Get updated user data
    user = AuthService.get_user_by_id(identity)
    return jsonify({"success": True, "user": user}), 200
