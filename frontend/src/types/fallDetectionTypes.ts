export interface FallDetectionResponse {
  output_video_url: string;
  fall_detected: boolean;
  message?: string; // Optional success message
  error?: string; // Optional error message
}
