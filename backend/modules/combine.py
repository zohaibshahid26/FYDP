import cv2
import librosa
import numpy as np
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet101
from transformers import Wav2Vec2Processor, Wav2Vec2ForSequenceClassification
from mtcnn import MTCNN
import warnings

warnings.filterwarnings("ignore")

# Define emotion classes (same for both models)
EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']


# Load pre-trained models from .pt files
def load_models(resnet_pt_path, wav2vec_pt_path):
    print("Starting to load models...")
    # ResNet101 for facial emotions
    print("Loading ResNet101 model...")
    resnet = resnet101(pretrained=False)
    num_ftrs = resnet.fc.in_features
    resnet.fc = torch.nn.Linear(num_ftrs, len(EMOTIONS))  # 7 emotions
    resnet.load_state_dict(torch.load(resnet_pt_path, map_location=torch.device('cpu')))
    resnet.eval()
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    resnet.to(device)
    print(f"ResNet101 loaded and moved to {device}")

    # Wav2Vec for voice emotions
    print("Loading Wav2Vec2 model and processor...")
    # Use a model fine-tuned for classification or initialize with a compatible base model
    try:
        # Try a known fine-tuned model for emotion classification, or use a base model
        wav2vec_processor = Wav2Vec2Processor.from_pretrained('facebook/wav2vec2-base-960h')
        wav2vec = Wav2Vec2ForSequenceClassification.from_pretrained(
            'facebook/wav2vec2-base-960h',
            num_labels=len(EMOTIONS),
            ignore_mismatched_sizes=True  # Allow loading custom weights even if sizes differ
        )
    except Exception as e:
        print(f"Error loading pretrained model: {e}")
        print("Falling back to initializing Wav2Vec2 model without pretrained weights...")
        from transformers import Wav2Vec2Config
        config = Wav2Vec2Config.from_pretrained('facebook/wav2vec2-base-960h', num_labels=len(EMOTIONS))
        wav2vec = Wav2Vec2ForSequenceClassification(config)
        wav2vec_processor = Wav2Vec2Processor.from_pretrained('facebook/wav2vec2-base-960h')

    print("Loading custom Wav2Vec2 weights...")
    wav2vec.load_state_dict(torch.load(wav2vec_pt_path, map_location=torch.device('cpu')))
    wav2vec.eval()
    wav2vec.to(device)
    print(f"Wav2Vec2 loaded and moved to {device}")

    print("Model loading complete.")
    return resnet, wav2vec, wav2vec_processor, device

# Preprocess image for ResNet101
def preprocess_image(image):
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return transform(image).unsqueeze(0)

# Preprocess audio for Wav2Vec
def preprocess_audio(audio, sample_rate=16000):
    if sample_rate != 16000:
        print(f"Resampling audio from {sample_rate} Hz to 16000 Hz...")
        audio = librosa.resample(audio, orig_sr=sample_rate, target_sr=16000)
    return audio
# Extract frames and audio from video
def extract_video_data(video_path, frame_rate=1):
    print(f"Extracting data from video: {video_path}")
    cap = cv2.VideoCapture(video_path)
    frames = []
    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps / frame_rate)
    print(f"Video FPS: {fps:.2f}, Frame interval: {frame_interval}")

    detector = MTCNN()
    print("Detecting faces in video frames...")
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_interval == 0:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            faces = detector.detect_faces(frame_rgb)
            if faces:
                x, y, w, h = faces[0]['box']
                face = frame_rgb[max(0, y):y+h, max(0, x):x+w]
                if face.size > 0:
                    frames.append(face)
                    print(f"Face detected in frame {frame_count}")
        frame_count += 1
    cap.release()
    print(f"Total frames processed: {frame_count}, Faces extracted: {len(frames)}")

    print("Extracting audio from WAV file...")
    audio, sr = librosa.load("audio.wav", sr=None)  # Load from WAV file
    print(f"Audio extracted, Sample rate: {sr} Hz, Duration: {len(audio)/sr:.2f} seconds")
    return frames, audio, sr
# Get emotion probabilities from ResNet101
def get_facial_emotions(resnet, frames, device):
    print("Processing facial emotions with ResNet101...")
    probabilities = []
    for i, frame in enumerate(frames):
        input_tensor = preprocess_image(frame).to(device)
        with torch.no_grad():
            output = resnet(input_tensor)
            probs = torch.softmax(output, dim=1).cpu().numpy()[0]
            probabilities.append(probs)
            dominant_emotion = EMOTIONS[np.argmax(probs)]
            print(f"Frame {i+1}/{len(frames)}: Dominant emotion = {dominant_emotion} ({max(probs)*100:.1f}%)")
    print(f"Facial emotion processing complete. Total frames analyzed: {len(probabilities)}")
    return np.array(probabilities)  # Shape: (num_frames, 7)

# Get emotion probabilities from Wav2Vec
def get_voice_emotions(wav2vec, processor, audio, sr, device, segment_length=2):
    print("Processing voice emotions with Wav2Vec2...")
    audio = preprocess_audio(audio, sr)
    segment_samples = segment_length * 16000
    probabilities = []

    for i in range(0, len(audio), segment_samples):
        segment = audio[i:i+segment_samples]
        if len(segment) < segment_samples:
            segment = np.pad(segment, (0, segment_samples - len(segment)))
            print(f"Padding audio segment {i//segment_samples + 1} to match {segment_length} seconds")

        inputs = processor(segment, sampling_rate=16000, return_tensors="pt", padding=True)
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = wav2vec(**inputs).logits
            probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
            probabilities.append(probs)
            dominant_emotion = EMOTIONS[np.argmax(probs)]
            print(f"Audio segment {i//segment_samples + 1}: Dominant emotion = {dominant_emotion} ({max(probs)*100:.1f}%)")

    print(f"Voice emotion processing complete. Total segments analyzed: {len(probabilities)}")
    return np.array(probabilities)  # Shape: (num_segments, 7)

# Combine facial and voice probabilities
def combine_probabilities(face_probs, voice_probs, video_duration, frame_rate=1, segment_length=2):
    print("Combining facial and voice emotion probabilities...")
    num_frames = len(face_probs)
    num_segments = len(voice_probs)
    print(f"Face probabilities: {num_frames} frames, Voice probabilities: {num_segments} segments")

    frames_per_segment = int(frame_rate * segment_length)
    combined_probs = []

    for i in range(min(num_segments, (num_frames // frames_per_segment) + 1)):
        start_frame = i * frames_per_segment
        end_frame = min((i + 1) * frames_per_segment, num_frames)
        if end_frame > start_frame:
            face_segment_probs = np.mean(face_probs[start_frame:end_frame], axis=0)
        else:
            face_segment_probs = face_probs[start_frame] if start_frame < num_frames else np.zeros(len(EMOTIONS))
        voice_segment_probs = voice_probs[i] if i < num_segments else np.zeros(len(EMOTIONS))

        combined = (face_segment_probs + voice_segment_probs) / 2
        combined_probs.append(combined)
        dominant_emotion = EMOTIONS[np.argmax(combined)]
        print(f"Segment {i+1}: Combined dominant emotion = {dominant_emotion} ({max(combined)*100:.1f}%)")

    print(f"Probability combination complete. Total combined segments: {len(combined_probs)}")
    return np.array(combined_probs)  # Shape: (num_segments, 7)

# Analyze temporal trends in emotions
def analyze_temporal_trends(combined_probs, segment_length=2):
    print("Analyzing temporal emotion trends...")
    trends = []
    dominant_emotions = []

    for i, probs in enumerate(combined_probs):
        time_start = i * segment_length
        time_end = (i + 1) * segment_length
        max_prob = np.max(probs)
        dominant_emotion = EMOTIONS[np.argmax(probs)]
        dominant_emotions.append((time_start, time_end, dominant_emotion, max_prob))
        trend = f"[{time_start:.1f}s - {time_end:.1f}s]: {dominant_emotion.capitalize()} ({max_prob*100:.1f}%)"
        trends.append(trend)
        print(f"Trend for segment {i+1}: {trend}")

    changes = []
    for i in range(1, len(dominant_emotions)):
        prev_emotion = dominant_emotions[i-1][2]
        curr_emotion = dominant_emotions[i][2]
        if prev_emotion != curr_emotion:
            time = dominant_emotions[i][0]
            change = f"Emotion shift from {prev_emotion.capitalize()} to {curr_emotion.capitalize()} at {time:.1f}s"
            changes.append(change)
            print(change)

    sad_std = np.std(combined_probs[:, EMOTIONS.index('sad')]) * 100
    happy_std = np.std(combined_probs[:, EMOTIONS.index('happy')]) * 100
    if sad_std > 15:
        change = f"High variability in sadness ({sad_std:.1f}%)"
        changes.append(change)
        print(change)
    if happy_std > 15:
        change = f"High variability in happiness ({happy_std:.1f}%)"
        changes.append(change)
        print(change)

    print("Temporal trend analysis complete.")
    return trends, changes

# Map emotions to mental health indicators
def map_to_mental_health(combined_probs):
    print("Mapping emotions to mental health indicators...")
    avg_probs = np.mean(combined_probs, axis=0)
    emotion_scores = dict(zip(EMOTIONS, avg_probs))

    mental_health_insights = []

    if emotion_scores['sad'] > 0.5 or (emotion_scores['sad'] + emotion_scores['neutral']) > 0.7:
        insight = f"Potential low mood detected ({emotion_scores['sad']*100:.1f}% sadness)"
        mental_health_insights.append(insight)
        print(insight)

    if emotion_scores['fear'] > 0.4 or emotion_scores['angry'] > 0.4:
        insight = f"Potential anxiety detected ({max(emotion_scores['fear'], emotion_scores['angry'])*100:.1f}% confidence)"
        mental_health_insights.append(insight)
        print(insight)

    if emotion_scores['happy'] > 0.6:
        insight = f"Positive mental state detected ({emotion_scores['happy']*100:.1f}% happiness)"
        mental_health_insights.append(insight)
        print(insight)

    if emotion_scores['surprise'] > 0.4:
        insight = f"Possible emotional reactivity detected ({emotion_scores['surprise']*100:.1f}% surprise)"
        mental_health_insights.append(insight)
        print(insight)

    if not mental_health_insights:
        insight = "No clear mental health indicators detected."
        mental_health_insights.append(insight)
        print(insight)

    print("Mental health mapping complete.")
    return emotion_scores, mental_health_insights

# Main function to process a video
def process_video(video_path, resnet_pt_path, wav2vec_pt_path):
    print(f"Starting video processing for: {video_path}")
    resnet, wav2vec, wav2vec_processor, device = load_models(resnet_pt_path, wav2vec_pt_path)

    print("Extracting video data...")
    frames, audio, sr = extract_video_data(video_path)
    if not frames or len(audio) == 0:
        print("Error: No faces or audio detected in the video.")
        return "Error: No faces or audio detected in the video."

    print("Computing facial emotions...")
    face_probs = get_facial_emotions(resnet, frames, device)
    if len(face_probs) == 0:
        print("Error: No valid facial features extracted.")
        return "Error: No valid facial features extracted."

    print("Computing voice emotions...")
    voice_probs = get_voice_emotions(wav2vec, wav2vec_processor, audio, sr, device, segment_length=2)
    if len(voice_probs) == 0:
        print("Error: No valid audio features extracted.")
        return "Error: No valid audio features extracted."

    video_duration = len(audio) / sr
    print(f"Video duration: {video_duration:.2f} seconds")
    print("Combining probabilities...")
    combined_probs = combine_probabilities(face_probs, voice_probs, video_duration)

    print("Analyzing temporal trends...")
    trends, changes = analyze_temporal_trends(combined_probs)

    print("Mapping to mental health insights...")
    emotion_scores, mental_health_insights = map_to_mental_health(combined_probs)

    print("Generating final output...")
    output = "Temporal Emotion Trends:\n"
    for trend in trends:
        output += f"- {trend}\n"
    if changes:
        output += "\nNotable Changes:\n"
        for change in changes:
            output += f"- {change}\n"

    output += "\nEmotion Scores (Average):\n"
    for emotion, score in emotion_scores.items():
        output += f"{emotion.capitalize()}: {score*100:.1f}%\n"

    output += "\nMental Health Insights:\n"
    for insight in mental_health_insights:
        output += f"- {insight}\n"

    output += "\nNote: This is not a clinical diagnosis. Consult a mental health professional."
    print("Video processing complete.")

    return output