"""
Authentication service for user management with JWT
"""
import os
import datetime
from email_validator import validate_email, EmailNotValidError
from flask_jwt_extended import create_access_token, create_refresh_token
from bson.objectid import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client.ealth_db
users_collection = db.users

class AuthService:
    """Service for user authentication and management"""

    @staticmethod
    def validate_registration_data(data):
        """Validate user registration data"""
        errors = {}

        # Validate email
        try:
            if not data.get('email'):
                errors['email'] = "Email is required"
            else:
                valid = validate_email(data['email'])
                data['email'] = valid.normalized  # Normalize the email
        except EmailNotValidError as e:
            errors['email'] = str(e)

        # Validate name
        if not data.get('name'):
            errors['name'] = "Name is required"
        elif len(data['name']) < 2:
            errors['name'] = "Name must be at least 2 characters"

        # Validate password
        if not data.get('password'):
            errors['password'] = "Password is required"
        elif len(data['password']) < 8:
            errors['password'] = "Password must be at least 8 characters"

        # Check if email already exists
        if not errors.get('email') and users_collection.find_one({"email": data['email']}):
            errors['email'] = "Email already registered"

        return errors if errors else None

    @staticmethod
    def register_user(user_data):
        """Register a new user"""
        # Hash the password
        hashed_password = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt())


        # Create user document
        new_user = {
            "name": user_data['name'],
            "email": user_data['email'],
            "password": hashed_password,
            "role": "user",
            "created_at": datetime.datetime.utcnow()
        }
        
        # Insert user and return user_id (without password)
        result = users_collection.insert_one(new_user)
        user_id = str(result.inserted_id)
        
        return {"id": user_id, "name": user_data['name'], "email": user_data['email'], "role": "user"}

    @staticmethod
    def login_user(email, password):
        """Authenticate user and generate tokens"""
        # Find user by email
        user = users_collection.find_one({"email": email})
        
        if not user or not bcrypt.checkpw(password, user["password"].encode('utf-8')):
            return None  # Authentication failed
        
        # Generate tokens
        access_token = create_access_token(
            identity=str(user['_id']),
            additional_claims={"name": user['name'], "email": user['email'], "role": user['role']}
        )
        
        refresh_token = create_refresh_token(identity=str(user['_id']))
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": str(user['_id']),
                "name": user['name'],
                "email": user['email'],
                "role": user.get('role', 'user')
            }
        }

    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        try:
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user['_id'] = str(user['_id'])
                if 'password' in user:
                    del user['password']  # Don't return password
                return user
            return None
        except:
            return None

    @staticmethod
    def update_user(user_id, update_data):
        """Update user information"""
        # Don't allow updating email or role through this method
        safe_update = {}
        if 'name' in update_data:
            safe_update['name'] = update_data['name']
            
        if not safe_update:
            return False
            
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": safe_update}
        )
        
        return result.modified_count > 0
