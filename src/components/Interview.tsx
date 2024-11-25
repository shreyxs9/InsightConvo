import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Play, Pause, SkipForward, AlertCircle, Mic, StopCircle } from "lucide-react";
import axios from "axios"; // Import axios

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [transcription, setTranscription] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const webcamRef = useRef<Webcam>(null);

  const questions = [
    "Tell me about yourself and your background.",
    "What interests you about this position?",
    "Describe a challenging situation you've faced at work.",
    "Where do you see yourself in 5 years?",
    "Do you have any questions for us?",
  ];

  const insights = {
    confidence: 85,
    engagement: 92,
    clarity: 88,
    emotions: ["neutral", "confident", "thoughtful"],
  };

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
        await sendToTranscriptionService(audioBlob); // Send audio to transcription service
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Unable to access your microphone. Please allow microphone permissions.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Send audio to a transcription service using axios
  const sendToTranscriptionService = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob);

    try {
      const response = await axios.post("http://localhost:3000/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data)
      setTranscription(response.data.transcription); // Assuming response contains 'transcription'
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              className="w-full rounded-xl"
              mirrored
              screenshotFormat="image/jpeg"
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={toggleRecording}
                  className={`p-3 rounded-full ${isRecording ? "bg-red-500" : "bg-blue-500"} hover:opacity-90 transition-opacity`}
                >
                  {isRecording ? <StopCircle className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
                <button
                  onClick={nextQuestion}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>
              {isRecording && (
                <div className="flex items-center bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2" />
                  <span>Recording</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Current Question</h2>
            <p className="text-lg text-gray-300 mb-4">{questions[currentQuestion]}</p>
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              {isRecording && <span>00:45</span>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6">Real-time Analysis</h2>
            <div className="space-y-4">
              <Metric label="Confidence" value={insights.confidence} />
              <Metric label="Engagement" value={insights.engagement} />
              <Metric label="Clarity" value={insights.clarity} />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Transcription</h2>
            {transcription ? (
              <p className="text-gray-300">{transcription}</p>
            ) : (
              <p className="text-gray-500 italic">No transcription available.</p>
            )}
          </div>

          <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-500">Interview Tips</h3>
                <p className="text-gray-300 text-sm mt-1">
                  Maintain eye contact with the camera and speak clearly. Take brief pauses between points to appear more confident and thoughtful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold">{value}%</span>
    </div>
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default Interview;
