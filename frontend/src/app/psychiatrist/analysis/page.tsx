"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmotionData } from "@/types/psychiatristTypes";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiArrowLeft,
  FiVideo,
  FiUpload,
  FiX,
  FiCamera,
  FiSquare,
  FiSave,
} from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnalysisPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoMode, setVideoMode] = useState<"upload" | "record">("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isCameraReady, setIsCameraReady] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [formData, setFormData] = useState<EmotionData>({
    patient_name: "",
    patient_age: "",
    patient_gender: "",
  });

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
    };
  }, []);

  const cleanupStreamsAndRecorder = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
      videoPreviewRef.current.src = "";
      videoPreviewRef.current.controls = false;
    }
    setIsCameraReady(false);
    setIsRecording(false);
    setRecordedChunks([]);
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
    setRecordingDuration(0);
  };

  useEffect(() => {
    if (videoMode === "record") {
      setVideoFile(null);
      initializeCameraPreview();
    } else {
      cleanupStreamsAndRecorder();
    }
  }, [videoMode]);

  const initializeCameraPreview = async () => {
    cleanupStreamsAndRecorder();
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.muted = true;
        videoPreviewRef.current.controls = false;
        await videoPreviewRef.current.play().catch((err) => {
          console.error("Error playing preview:", err);
          setError("Could not play camera preview. Please check permissions.");
          setIsCameraReady(false);
          return;
        });
      }
      setIsCameraReady(true);
    } catch (err) {
      console.error("Error accessing camera/microphone:", err);
      setError(
        "Could not access camera or microphone. Please grant permissions and try again."
      );
      setIsCameraReady(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setVideoFile(file);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.src = URL.createObjectURL(file);
      }
    }
  };

  const clearVideoFile = () => {
    setVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.src = "";
    }
  };

  const startRecording = async () => {
    if (!isCameraReady || !streamRef.current) {
      setError("Camera not ready. Please wait or re-enable recording mode.");
      await initializeCameraPreview();
      if (!isCameraReady || !streamRef.current) {
        setError("Failed to initialize camera for recording.");
        return;
      }
    }

    setRecordedChunks([]);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.src = "";
      videoPreviewRef.current.srcObject = streamRef.current;
      videoPreviewRef.current.muted = true;
      videoPreviewRef.current.controls = false;
    }

    setIsRecording(true);
    setRecordingDuration(0);

    const mimeTypes = [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2", // MP4 H.264, AAC
      "video/mp4", // Generic MP4y
      "video/webm;codecs=vp9,opus", // WebM VP9, Opus
      "video/webm;codecs=vp8,opus", // WebM VP8, Opus
      "video/webm", // Generic WebM
    ];
    let selectedMimeType = "";
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        console.log("Using MIME type for recording:", selectedMimeType);
        break;
      }
    }

    if (!selectedMimeType) {
      setError(
        "Video recording is not supported by your browser, or no suitable codec found. WebM will be attempted."
      );
      // Fallback to a basic WebM if nothing specific is supported
      selectedMimeType = "video/webm";
      if (!MediaRecorder.isTypeSupported(selectedMimeType)) {
        setError(
          "Video recording (including WebM fallback) is not supported by your browser."
        );
        setIsRecording(false);
        return;
      }
      console.log("Falling back to MIME type for recording:", selectedMimeType);
    }

    try {
      const localChunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: selectedMimeType,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          localChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        if (recordingTimer) {
          clearInterval(recordingTimer);
          setRecordingTimer(null);
        }

        setRecordedChunks(localChunks);

        if (localChunks.length > 0) {
          const blob = new Blob(localChunks, {
            type: mediaRecorderRef.current?.mimeType || selectedMimeType,
          });
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = null;
            videoPreviewRef.current.src = URL.createObjectURL(blob);
            videoPreviewRef.current.muted = false;
            videoPreviewRef.current.controls = true;
            videoPreviewRef.current
              .play()
              .catch((e) => console.error("Error playing recorded video:", e));
          }
        }
      };

      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        setError("An error occurred during recording.");
        setIsRecording(false);
        if (recordingTimer) clearInterval(recordingTimer);
      };

      mediaRecorder.start(250);

      const timer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setRecordingTimer(timer);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError(
        "Could not start recording. Your browser might not support this feature."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const saveRecording = () => {
    if (recordedChunks.length === 0) {
      setError("No recording available to save.");
      return;
    }

    const mimeType = mediaRecorderRef.current?.mimeType || "video/webm";
    let fileExtension = ".webm"; // Default extension

    if (mimeType.startsWith("video/mp4")) {
      fileExtension = ".mp4";
    }

    const blob = new Blob(recordedChunks, { type: mimeType });
    const file = new File(
      [blob],
      `patient_recording_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}${fileExtension}`,
      {
        type: mimeType,
      }
    );

    setVideoFile(file);
    setVideoMode("upload");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const ProcessingOverlay = () => (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white/80 p-8 rounded-xl max-w-md w-full mx-4 shadow-xl backdrop-blur-sm">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600/20 border-b-blue-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FiAlertCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Analyzing Video
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we process your video
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      setError("Please upload or record a video for analysis.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("video", videoFile);
      formDataUpload.append(
        "patient_info",
        JSON.stringify({
          patient_name: formData.patient_name,
          patient_age: formData.patient_age,
          patient_gender: formData.patient_gender,
        })
      );

      const response = await fetch("http://localhost:5000/analyze_video", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result = await response.json();
      localStorage.setItem("analysisResult", JSON.stringify(result));
      router.push("/psychiatrist/analysis/results");
    } catch (err) {
      setError(
        `Failed to analyze video: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/psychiatrist"
        className="flex items-center text-blue-600 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to Mental Health Services
      </Link>

      <div className="flex items-center mb-6">
        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
          <FiAlertCircle size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Emotion Analysis</h1>
          <p className="text-gray-500">
            Analyze patient emotions through video for mental health assessment
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="text-lg font-semibold mb-4">Choose Video Source</div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setVideoMode("upload")}
            className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
              videoMode === "upload"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <FiUpload
              size={24}
              className={`${
                videoMode === "upload" ? "text-blue-500" : "text-gray-500"
              } mb-2`}
            />
            <div
              className={`font-medium ${
                videoMode === "upload" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Upload Video
            </div>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Upload a pre-recorded video of the patient
            </p>
          </button>

          <button
            onClick={() => setVideoMode("record")}
            className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
              videoMode === "record"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <FiCamera
              size={24}
              className={`${
                videoMode === "record" ? "text-blue-500" : "text-gray-500"
              } mb-2`}
            />
            <div
              className={`font-medium ${
                videoMode === "record" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Record Video
            </div>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Record a new video of the patient now
            </p>
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="text-blue-500 mr-2">01</span> Patient
                Information
              </h2>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter patient's full name"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Age
              </label>
              <input
                type="text"
                name="patient_age"
                value={formData.patient_age}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="e.g., 35"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Gender
              </label>
              <select
                name="patient_gender"
                value={formData.patient_gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="text-blue-500 mr-2">02</span>
                {videoMode === "upload" ? "Upload Video" : "Record Video"}
              </h2>
            </div>

            {videoMode === "upload" ? (
              <div className="space-y-6">
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-gray-700">
                    Upload Patient Video
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload a video of the patient for automatic emotion
                    analysis. The video should show the patient's face and
                    include audio.
                  </p>

                  {!videoFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        ref={videoInputRef}
                      />
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">
                        Drag and drop a video file, or
                      </p>
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium hover:bg-blue-200 transition-colors"
                      >
                        Browse Files
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        MP4, MOV, or AVI files (max 500MB)
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="border rounded-lg p-4 bg-blue-50 flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <FiVideo className="text-blue-500 h-6 w-6 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {videoFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={clearVideoFile}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <FiX />
                        </button>
                      </div>

                      <div className="mt-4">
                        <video
                          ref={videoPreviewRef}
                          className="w-full h-auto rounded-lg border border-gray-200"
                          controls
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-gray-700">
                    Record Patient Video
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Record a video of the patient for automatic emotion
                    analysis. Ensure good lighting and clear audio for best
                    results.
                  </p>

                  <div className="border rounded-lg overflow-hidden bg-gray-900">
                    <video
                      ref={videoPreviewRef}
                      className="w-full h-auto aspect-video object-cover"
                      autoPlay
                      playsInline
                    />

                    <div className="p-4 bg-gray-800 flex justify-between items-center">
                      {isRecording ? (
                        <>
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                            <span className="text-white">
                              Recording: {formatTime(recordingDuration)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                          >
                            <FiSquare className="mr-2" /> Stop
                          </button>
                        </>
                      ) : recordedChunks.length > 0 ? (
                        <>
                          <span className="text-white">
                            Preview Recorded: {formatTime(recordingDuration)}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={saveRecording}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                            >
                              <FiSave className="mr-2" /> Save
                            </button>
                            <button
                              type="button"
                              onClick={initializeCameraPreview}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                            >
                              <FiCamera className="mr-2" /> Record Again
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-white">
                            {isCameraReady
                              ? "Ready to record"
                              : "Initializing camera..."}
                          </span>
                          <button
                            type="button"
                            onClick={startRecording}
                            disabled={!isCameraReady || isRecording}
                            className={`px-4 py-2 text-white rounded-md flex items-center ${
                              !isCameraReady || isRecording
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            <FiCamera className="mr-2" /> Start Recording
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800">
                  <p className="text-sm">
                    <strong>Tips:</strong> Record at least 30 seconds of the
                    patient speaking. Ensure their face is clearly visible and
                    ask open-ended questions to capture emotional responses.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={
              isLoading ||
              !videoFile ||
              (videoMode === "record" &&
                recordedChunks.length > 0 &&
                !videoFile)
            }
            className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 shadow-md"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing Video...
              </>
            ) : (
              <>
                <FiCheckCircle className="mr-2" />
                Process Video
              </>
            )}
          </button>
        </div>
      </form>
      {isLoading && <ProcessingOverlay />}
    </div>
  );
}
