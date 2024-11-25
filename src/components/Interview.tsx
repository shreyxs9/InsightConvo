import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { AlertCircle } from "lucide-react";
import axios from "axios";

const Interview: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState("Tell me about yourself and your background.");
  const [transcription, setTranscription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const webcamRef = useRef<Webcam>(null);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
        await sendToTranscriptionService(audioBlob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Unable to access your microphone. Please check your permissions.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Send audio to transcription service
  const sendToTranscriptionService = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTranscription(response.data.transcription);
      if (response.data.questions?.length > 0) {
        setCurrentQuestion(response.data.questions[0]); // Update the question with the first follow-up
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setError("An error occurred while processing the audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Video */}
        <div>
          <div className="relative aspect-w-4 aspect-h-3">
            <Webcam
              ref={webcamRef}
              className="w-full rounded-xl"
              mirrored
              screenshotFormat="image/jpeg"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={startRecording}
                className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white transition disabled:bg-gray-500"
                disabled={isRecording}
              >
                Start Recording
              </button>
              <button
                onClick={stopRecording}
                className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-400 text-white transition disabled:bg-gray-500"
                disabled={!isRecording}
              >
                Stop Recording
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Transcription and Current Question */}
        <div className="space-y-6">
          {/* Current Question */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Current Question</h2>
            <p className="text-lg text-gray-300 mb-4">{currentQuestion}</p>
          </div>

          {/* Transcription */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Transcription</h2>
            {loading ? (
              <p className="text-gray-500 italic">Processing audio, please wait...</p>
            ) : transcription ? (
              <p className="text-gray-300">{transcription}</p>
            ) : (
              <p className="text-gray-500 italic">No transcription available.</p>
            )}
          </div>

          {/* Error Handling */}
          {error && (
            <div className="bg-red-500 text-white rounded-lg p-4">
              <AlertCircle className="inline-block mr-2 h-5 w-5" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
