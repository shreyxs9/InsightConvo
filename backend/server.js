import express from "express";
import multer from "multer";
import cors from "cors";
import { SpeechClient } from "@google-cloud/speech";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());

const speechClient = new SpeechClient({ keyFilename: "./long-leaf-336308-60d419b7f42d.json" });
const genAI = new GoogleGenerativeAI("AIzaSyACLQ_FJAMbiOvhoa5ISBZtZkiC1rf6FuU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const upload = multer();

app.use(express.json());

app.post("/transcribe", upload.single("file"), async (req, res) => {
  const audioBuffer = req.file?.buffer;

  if (!audioBuffer) {
    return res.status(400).json({ error: "Audio data is required." });
  }

  const request = {
    config: {
      encoding: "WEBM_OPUS",
      sampleRateHertz: 48000,
      languageCode: "en-US",
    },
    audio: {
      content: audioBuffer.toString("base64"),
    },
  };

  try {
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    const followUpQuestions = await generateFollowUpQuestions(transcription);
    res.json({ transcription, questions: followUpQuestions });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to process audio" });
  }
});

const generateFollowUpQuestions = async (responseText) => {
  const prompt = `Based on the following response: "${responseText}", generate one follow-up question.`;
  const result = await model.generateContent(prompt);
  return [result.response.text()]; // Returns an array with a single follow-up question
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
