import unittest
from unittest.mock import patch, MagicMock
from flask import json
import os
import sys
import io
from werkzeug.datastructures import FileStorage

# Add parent directory to path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app

class TestRoutes(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # Auth Routes Tests
    def test_register(self):
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "TestPass123!"
        }
        response = self.app.post('/api/auth/register', 
                               json=test_data)
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertTrue(data['success'])

    def test_login(self):
        test_data = {
            "email": "test@example.com",
            "password": "TestPass123!"
        }
        response = self.app.post('/api/auth/login', 
                               json=test_data)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])

    # Additional Authentication Tests
    def test_register_invalid_email(self):
        test_data = {
            "name": "Test User",
            "email": "invalid-email",
            "password": "TestPass123!"
        }
        response = self.app.post('/api/auth/register', json=test_data)
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

    def test_register_weak_password(self):
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "weak"
        }
        response = self.app.post('/api/auth/register', json=test_data)
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

    def test_login_invalid_credentials(self):
        test_data = {
            "email": "nonexistent@example.com",
            "password": "WrongPass123!"
        }
        response = self.app.post('/api/auth/login', json=test_data)
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

    # Content Retrieval Tests
    def test_retrieve_content(self):
        test_data = {
            "query": "test query",
            "emotion": "happy"
        }
        response = self.app.post('/retrieve_content', 
                               json=test_data)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('content', data)

    # Additional Content Tests
    def test_retrieve_content_empty_query(self):
        test_data = {
            "query": "",
            "emotion": "happy"
        }
        response = self.app.post('/retrieve_content', json=test_data)
        self.assertEqual(response.status_code, 400)

    def test_retrieve_content_invalid_emotion(self):
        test_data = {
            "query": "test query",
            "emotion": "invalid_emotion"
        }
        response = self.app.post('/retrieve_content', json=test_data)
        self.assertEqual(response.status_code, 400)

    # Emotion Analysis Tests
    def test_analyze_emotions(self):
        test_data = {
            "patient_name": "Test Patient",
            "patient_age": "25",
            "patient_gender": "male",
            "facial_emotion": "happy",
            "facial_confidence": 0.8,
            "speech_emotion": "happy",
            "speech_confidence": 0.7,
            "combined_emotion": "happy",
            "combined_confidence": 0.75
        }
        response = self.app.post('/analyze', 
                               json=test_data)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('mental_health_assessment', data)

    # Arrhythmia Prediction Tests
    @patch('app.extract_signal_from_image')
    @patch('app.model_.predict')
    def test_predict_arrhythmia(self, mock_predict, mock_extract):
        mock_extract.return_value = MagicMock()
        mock_predict.return_value = [[0.8, 0.1, 0.05, 0.03, 0.02]]
        
        test_file = FileStorage(
            stream=io.BytesIO(b"test content"),
            filename="test.png",
            content_type="image/png",
        )
        
        response = self.app.post('/predict_arrhythmia',
                               content_type='multipart/form-data',
                               data={'file': test_file})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('prediction', data)

    # Heart Disease Prediction Tests
    def test_predict_heart_disease(self):
        test_data = {
            "Age": 45,
            "RestingBP": 130,
            "Cholesterol": 233,
            "FastingBS": 1,
            "MaxHR": 150,
            "Oldpeak": 2.3,
            "Sex": "M",
            "ChestPainType": "ATA",
            "RestingECG": "Normal",
            "ExerciseAngina": "N",
            "ST_Slope": "Up"
        }
        response = self.app.post('/predict-heart-disease-failure', 
                               json=test_data)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('risk', data)

    # Additional Heart Disease Prediction Tests
    def test_predict_heart_disease_missing_fields(self):
        test_data = {
            "Age": 45,
            "RestingBP": 130
            # Missing other required fields
        }
        response = self.app.post('/predict-heart-disease-failure', json=test_data)
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_predict_heart_disease_invalid_values(self):
        test_data = {
            "Age": -1,  # Invalid age
            "RestingBP": 130,
            "Cholesterol": 233,
            "FastingBS": 1,
            "MaxHR": 150,
            "Oldpeak": 2.3,
            "Sex": "M",
            "ChestPainType": "ATA",
            "RestingECG": "Normal",
            "ExerciseAngina": "N",
            "ST_Slope": "Up"
        }
        response = self.app.post('/predict-heart-disease-failure', json=test_data)
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    # Prescription Generation Tests
    def test_generate_prescription(self):
        test_data = {
            "patient_name": "Test Patient",
            "patient_age": "25",
            "patient_gender": "male",
            "mental_assessment": {
                "condition": "Anxiety",
                "severity": "Moderate"
            }
        }
        response = self.app.post('/generate_prescription', 
                               json=test_data)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('patient_information', data)

    # Chat Tests
    def test_chat_with_ai(self):
        test_data = {
            "message": "Hello, how are you?",
            "user_name": "Test User",
            "emotion": "neutral",
            "chat_history": []
        }
        response = self.app.post('/chat', 
                               json=test_data)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('message', data)

    # Additional Chat Tests
    def test_chat_empty_message(self):
        test_data = {
            "message": "",
            "user_name": "Test User",
            "emotion": "neutral",
            "chat_history": []
        }
        response = self.app.post('/chat', json=test_data)
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_chat_large_history(self):
        test_data = {
            "message": "Hello",
            "user_name": "Test User",
            "emotion": "neutral",
            "chat_history": [{"role": "user", "content": "test"} for _ in range(100)]
        }
        response = self.app.post('/chat', json=test_data)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('message', data)

    # File Chat Tests
    @patch('app.upload_file')
    @patch('app.process_file_with_gemini')
    @patch('app.delete_file')
    def test_chat_with_file(self, mock_delete, mock_process, mock_upload):
        mock_upload.return_value = MagicMock()
        mock_process.return_value = {
            'success': True,
            'message': 'Test response',
            'filename': 'test.pdf'
        }
        mock_delete.return_value = True

        test_file = FileStorage(
            stream=io.BytesIO(b"test content"),
            filename="test.pdf",
            content_type="application/pdf",
        )
        
        response = self.app.post('/chat_with_file',
                               content_type='multipart/form-data',
                               data={
                                   'file': test_file,
                                   'message': 'Analyze this file',
                                   'user_name': 'Test User'
                               })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('message', data)

    # Additional File Tests
    def test_chat_with_file_unsupported_type(self):
        test_file = FileStorage(
            stream=io.BytesIO(b"test content"),
            filename="test.exe",
            content_type="application/x-msdownload",
        )
        
        response = self.app.post('/chat_with_file',
                               content_type='multipart/form-data',
                               data={
                                   'file': test_file,
                                   'message': 'Analyze this file',
                                   'user_name': 'Test User'
                               })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_chat_with_file_no_message(self):
        test_file = FileStorage(
            stream=io.BytesIO(b"test content"),
            filename="test.pdf",
            content_type="application/pdf",
        )
        
        response = self.app.post('/chat_with_file',
                               content_type='multipart/form-data',
                               data={
                                   'file': test_file,
                                   'user_name': 'Test User'
                               })
        self.assertEqual(response.status_code, 200)  # Should still work with default message

    # PDF Report Generation Tests
    def test_generate_pdf_report(self):
        test_data = {
            "report_type": "analysis",
            "report_data": {
                "patient_information": {
                    "name": "Test Patient",
                    "age": "25",
                    "gender": "male"
                },
                "mental_health_assessment": "Test assessment"
            }
        }
        response = self.app.post('/generate_pdf_report', 
                               json=test_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, 'application/pdf')

    # Video Analysis Tests
    @patch('app.process_video')
    def test_analyze_video(self, mock_process):
        mock_process.return_value = {
            "facial_emotion": "happy",
            "speech_emotion": "happy"
        }

        test_file = FileStorage(
            stream=io.BytesIO(b"test content"),
            filename="test.mp4",
            content_type="video/mp4",
        )
        
        response = self.app.post('/analyze_video',
                               content_type='multipart/form-data',
                               data={
                                   'video': test_file,
                                   'patient_info': json.dumps({
                                       "patient_name": "Test Patient",
                                       "patient_age": "25",
                                       "patient_gender": "male"
                                   })
                               })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('emotion_analysis', data)

    # Additional Video Analysis Tests
    @patch('app.process_video')
    def test_analyze_video_no_patient_info(self, mock_process):
        mock_process.return_value = {
            "facial_emotion": "happy",
            "speech_emotion": "happy"
        }

        test_file = FileStorage(
            stream=io.BytesIO(b"test content"),
            filename="test.mp4",
            content_type="video/mp4",
        )
        
        response = self.app.post('/analyze_video',
                               content_type='multipart/form-data',
                               data={'video': test_file})
        self.assertEqual(response.status_code, 200)  # Should work with default patient info

    @patch('app.process_video')
    def test_analyze_video_invalid_format(self, mock_process):
        test_file = FileStorage(
            stream=io.BytesIO(b"test content"),
            filename="test.txt",
            content_type="text/plain",
        )
        
        response = self.app.post('/analyze_video',
                               content_type='multipart/form-data',
                               data={'video': test_file})
        self.assertEqual(response.status_code, 400)

    # Fall Detection Tests
    @patch('app.process_video_for_fall_detection')
    def test_fall_detection(self, mock_process):
        mock_process.return_value = (True, None)  # fall_detected, error_msg

        test_file = FileStorage(
            stream=io.BytesIO(b"test content"),
            filename="test.mp4",
            content_type="video/mp4",
        )
        
        response = self.app.post('/fall_detection_video',
                               content_type='multipart/form-data',
                               data={'video': test_file})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('fall_detected', data)
        self.assertIn('output_video_url', data)

if __name__ == '__main__':
    unittest.main()
