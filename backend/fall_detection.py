import cv2
import tensorflow as tf
import numpy as np
from datetime import datetime
import os
from ultralytics import YOLO  # YOLOv8 library


# Paths
saved_model_path = 'models/movinet2'
yolov8_weights_path = 'models/yolov8n.pt'

# Load the fine-tuned MoviNet model
model = tf.saved_model.load(saved_model_path)
infer = model.signatures["serving_default"]

# Load YOLOv8 model
yolo_model = YOLO(yolov8_weights_path)  # Load YOLOv8 model

# Function to preprocess frames for MoviNet
def preprocess_frame(frame):
    frame = cv2.resize(frame, (224, 224))  # Resize to model input size
    frame = frame / 255.0  # Normalize to range [0, 1]
    frame = np.expand_dims(frame, axis=0)  # Add batch dimension
    frame = np.expand_dims(frame, axis=0)  # Add temporal dimension
    return frame.astype(np.float32)

# Function to detect persons using YOLOv8
def detect_objects(frame):
    """Detect persons in a frame using YOLOv8."""
    results = yolo_model(frame)
    detections = results[0].boxes.xyxy.cpu().numpy()  # Bounding boxes
    confidences = results[0].boxes.conf.cpu().numpy()  # Confidence scores
    class_ids = results[0].boxes.cls.cpu().numpy().astype(int)  # Class IDs
    return [(bbox, conf) for bbox, conf, cls_id in zip(detections, confidences, class_ids) if cls_id == 0]  # Filter persons



def process_video_for_fall_detection(input_video_path, output_video_path):
    """
    Process the input video for fall detection and save the output video.
    
    Args:
        input_video_path (str): Path to the input video file.
        output_video_path (str): Path to save the output video file.
        
    Returns:
        tuple: (fall_detected (bool), error_message (str))
    """
    # Check if input video exists
    if not os.path.exists(input_video_path):
        return False, f"Error: Input video {input_video_path} does not exist."
        
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_video_path), exist_ok=True)
    
    try:
        # Open the input video
        cap = cv2.VideoCapture(input_video_path)
        if not cap.isOpened():
            return False, "Error: Could not open the input video."

        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        # Define codec and create VideoWriter
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

        # Variables to track fall detection and bounding box
        fall_detected = False
        tracker = None  # To hold the OpenCV tracker
        fall_occurred = False  # To track if fall has already occurred

        # Process video frame by frame
        frame_number = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Initialize tracker if not already initialized
            if tracker is None and not fall_occurred:
                # Detect persons using YOLOv8
                detections = detect_objects(frame)
                if detections:
                    bbox, _ = detections[0]  # Take the first detected person
                    x1, y1, x2, y2 = map(int, bbox)


            # Preprocess the frame for MoviNet
            processed_frame = preprocess_frame(frame)
            try:
                # Run inference
                predictions = infer(image=processed_frame)
                raw_output = predictions['classifier_head_2'].numpy()
                fall_probability = raw_output[0][0]  # Probability for "fall" class
                nofall_probability = raw_output[0][1]  # Probability for "nofall" class
                fall_detected = fall_probability > nofall_probability
            except Exception as e:
                return False, f"Error during MoviNet inference: {e}"

            # Once fall is detected, keep the rectangle red and text "FALL DETECTED"
            if fall_detected and not fall_occurred:
                fall_occurred = True  # Mark that fall has occurred

            # Draw bounding box and text
            if tracker is not None:
                color = (0, 0, 255) if fall_occurred else (0, 255, 0)  # Red for fall, green otherwise
                thickness = 5  # Thicker bounding box for better visibility
                label = "FALL DETECTED" if fall_occurred else "Person"
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, thickness)
                # More elegant text: bigger and shadowed
                cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color, 3)

            # Overlay status text with improved design
            status_text = "FALL DETECTED" if fall_occurred else "NO FALL"
            status_color = (0, 0, 255) if fall_occurred else (0, 255, 0)
            # Add shadow to status text for better visibility
            cv2.putText(frame, status_text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 0), 5, cv2.LINE_AA)
            cv2.putText(frame, status_text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, status_color, 3, cv2.LINE_AA)

            # Adjust bounding box around the person if necessary (in case the person is outside the box)
            if fall_occurred:
                # Detect the person again if fall occurred and update tracker accordingly
                detections = detect_objects(frame)
                if detections:
                    bbox, _ = detections[0]  # Get updated bounding box
                    x1, y1, x2, y2 = map(int, bbox)
                    # Increase bounding box size to ensure it fully includes the person after falling
                    margin = 20  # Add margin to the bounding box
                    x1, y1 = max(0, x1 - margin), max(0, y1 - margin)
                    x2, y2 = min(width, x2 + margin), min(height, y2 + margin)
                    x, y, w, h = x1, y1, x2 - x1, y2 - y1

            # Write the frame to the output video
            out.write(frame)
            frame_number += 1

        # Release resources
        cap.release()
        out.release()
        
        return fall_occurred, ""  # Return fall detection status and empty error message if successful
    
    except Exception as e:
        return False, f"Unexpected error during video processing: {str(e)}"
