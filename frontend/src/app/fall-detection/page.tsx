"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiUpload,
  FiVideo,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowLeft,
  FiLoader,
  FiX,
  FiCamera,
  FiEye,
} from "react-icons/fi";
import { uploadAndProcessFallDetectionVideo } from "@/api/fallDetectionService";
import { FallDetectionResponse } from "@/types/fallDetectionTypes";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function FallDetectionPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FallDetectionResponse | null>(null);
  const [detectionMode, setDetectionMode] = useState<"upload" | "live">(
    "upload"
  );
  const [processingStage, setProcessingStage] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);

  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clean up the object URL when the component unmounts or videoFile changes
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        setError("File is too large. Please upload a video under 100MB.");
        setVideoFile(null);
        setVideoPreviewUrl(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(previewUrl);
      setResult(null);
      setError(null);
    }
  };

  const clearVideoFile = () => {
    setVideoFile(null);
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = ""; // Reset file input
    }
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!videoFile && detectionMode === "upload") {
      setError("Please select a video file to upload.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setProcessingProgress(0);
    setProcessingStage("Starting analysis...");

    try {
      if (detectionMode === "upload") {
        // Simulate processing stages
        const stages = [
          { progress: 20, message: "Uploading video..." },
          { progress: 40, message: "Preprocessing frames..." },
          { progress: 60, message: "Applying fall detection model..." },
          { progress: 80, message: "Analyzing movements..." },
          { progress: 90, message: "Finalizing results..." },
        ];

        let currentStage = 0;
        const progressInterval = setInterval(() => {
          if (currentStage < stages.length) {
            setProcessingProgress(stages[currentStage].progress);
            setProcessingStage(stages[currentStage].message);
            currentStage++;
          }
        }, 1500);

        const response = await uploadAndProcessFallDetectionVideo(videoFile!);

        clearInterval(progressInterval);
        setProcessingProgress(100);
        setProcessingStage("Analysis complete!");

        if (response.error) {
          setError(response.error);
          setResult(null);
        } else {
          // Add a small delay to show completion
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setResult(response);
        }
      } else {
        setError(
          "Live detection is not implemented yet. Please use the video upload option."
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to process video. Please try again.");
      console.error("Fall detection error:", err);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const ProcessingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <FiEye
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600"
                size={20}
              />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {processingStage}
            </h3>
            <div className="mt-4 relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {processingProgress}% Complete
            </p>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>Please keep this window open</p>
            <p>Processing may take a few minutes depending on video length</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/" className="flex items-center text-blue-600 mb-6">
          <FiArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="flex items-center mb-6">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
            <FiEye size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fall Detection</h1>
            <p className="text-gray-500">
              Detect falls in video footage using AI technology
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Detection Mode Selection */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="text-lg font-semibold mb-4">
            Choose Detection Mode
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setDetectionMode("upload")}
              className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                detectionMode === "upload"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FiUpload
                size={24}
                className={`${
                  detectionMode === "upload" ? "text-blue-500" : "text-gray-500"
                } mb-2`}
              />
              <div
                className={`font-medium ${
                  detectionMode === "upload" ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Upload Video
              </div>
              <p className="text-sm text-gray-500 mt-1 text-center">
                Upload a pre-recorded video for fall detection
              </p>
            </button>

            <button
              onClick={() => setDetectionMode("live")}
              className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                detectionMode === "live"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FiCamera
                size={24}
                className={`${
                  detectionMode === "live" ? "text-blue-500" : "text-gray-500"
                } mb-2`}
              />
              <div
                className={`font-medium ${
                  detectionMode === "live" ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Live Detection
              </div>
              <p className="text-sm text-gray-500 mt-1 text-center">
                Use your camera for real-time fall detection (coming soon)
              </p>
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          {detectionMode === "upload" ? (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="text-blue-500 mr-2">01</span> Upload Video
                  for Fall Detection
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Upload a video file to analyze for potential fall incidents
                </p>
              </div>

              <div className="mt-4">
                {!videoFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
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
                      MP4, MOV, or AVI files (max 100MB)
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
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Video Preview:
                      </label>
                      <video
                        src={videoPreviewUrl || undefined}
                        controls
                        className="w-full h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="text-blue-500 mr-2">01</span> Live Fall
                  Detection
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Use your camera for real-time fall detection monitoring
                </p>
              </div>

              <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
                <div className="flex">
                  <FiAlertTriangle className="text-yellow-500 h-5 w-5 mr-2" />
                  <p className="text-sm text-yellow-700">
                    Live detection is coming soon. Please use the video upload
                    option for now.
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FiCamera size={48} className="mx-auto mb-2" />
                    <p>Camera access required</p>
                    <p className="text-xs">This feature is not yet available</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-800 flex justify-between items-center">
                  <span className="text-white">Live Detection</span>
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 bg-gray-600 text-white rounded-md cursor-not-allowed"
                  >
                    <FiCamera className="mr-2 inline" /> Start Camera (Coming
                    Soon)
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={
                isLoading ||
                (detectionMode === "upload" && !videoFile) ||
                detectionMode === "live"
              }
              className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 shadow-md"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Processing...
                </>
              ) : detectionMode === "upload" ? (
                <>
                  <FiVideo className="mr-2" />
                  Detect Falls in Video
                </>
              ) : (
                <>
                  <FiCamera className="mr-2" />
                  Start Live Detection
                </>
              )}
            </button>
          </div>
        </form>

        {result && (
          <div className="bg-white p-8 rounded-xl shadow-lg mt-6">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Detection Results
            </h2>

            <div className="p-8 rounded-lg border-2 flex flex-col items-center">
              {result.fall_detected ? (
                <>
                  <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                    <FiAlertTriangle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-red-700">
                    FALL DETECTED
                  </h3>
                  <p className="text-gray-600 text-center mt-3">
                    The system has detected a fall event in the provided video.
                  </p>
                  <p className="mt-6 text-sm text-gray-500">
                    Please check on the person or alert caretakers immediately.
                  </p>
                </>
              ) : (
                <>
                  <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <FiCheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700">
                    NO FALL DETECTED
                  </h3>
                  <p className="text-gray-600 text-center mt-3">
                    No fall events were detected in the provided video.
                  </p>
                  <p className="mt-6 text-sm text-gray-500">
                    Continue monitoring as needed.
                  </p>
                </>
              )}

              <button
                onClick={clearVideoFile}
                className="mt-8 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
              >
                <FiUpload className="mr-2" />
                Process Another Video
              </button>
            </div>
          </div>
        )}

        {isLoading && <ProcessingOverlay />}
      </div>
    </ProtectedRoute>
  );
}
