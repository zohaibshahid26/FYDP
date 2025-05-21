import numpy as np
import cv2
from scipy.signal import resample


def extract_signal_from_image(image_bytes, target_length=187):
    print("Inside extract_signal_from_image")

    # Convert byte array to numpy array
    np_arr = np.frombuffer(image_bytes, np.uint8)
    print(f"Byte array size: {np_arr.size}")

    # Decode the image
    img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Invalid image data. Cannot decode image.")

    print(f"Original image shape: {img.shape}")

    # Resize the image
    img = cv2.resize(img, (500, 100))
    print(f"Resized image shape: {img.shape}")

    # Threshold to binary (inverse: ECG waveform becomes white on black background)
    _, binary = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV)

    # Extract the vertical position of the waveform from each column
    signal = []
    for col in range(binary.shape[1]):
        column_pixels = np.where(binary[:, col] > 0)[0]
        signal.append(np.mean(column_pixels) if column_pixels.size > 0 else np.nan)

    signal = np.array(signal)
    print(f"Raw extracted signal (with NaNs): {signal[:10]}")

    # Interpolate and fill missing values
    nans, x = np.isnan(signal), lambda z: z.nonzero()[0]
    if np.all(nans):
        raise ValueError("Entire signal is empty after processing.")

    signal[nans] = np.interp(x(nans), x(~nans), signal[~nans])
    print(f"Interpolated signal: {signal[:10]}")

    # Normalize (z-score)
    std = np.std(signal)
    if std == 0:
        raise ValueError("Standard deviation of signal is zero. Cannot normalize.")

    signal = (signal - np.mean(signal)) / std
    print(f"Normalized signal: {signal[:10]}")

    # Resample to target length
    signal_resampled = resample(signal, target_length)
    print(f"Resampled signal shape: {signal_resampled.shape}")

    # Reshape for model input (batch_size, time_steps, channels)
    processed_ecg = signal_resampled.reshape(1, target_length, 1)
    print("Processed ECG shape:", processed_ecg.shape)

    return processed_ecg
