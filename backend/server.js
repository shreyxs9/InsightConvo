import express from 'express';
import multer from 'multer';
import cors from 'cors'; // Import CORS middleware
import { SpeechClient } from '@google-cloud/speech';

const app = express();

// Enable CORS for all origins
app.use(cors());

const speechClient = new SpeechClient({
  keyFilename: './long-leaf-336308-60d419b7f42d.json', // Update with your path
});
const upload = multer(); // Will handle incoming form-data

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to handle real-time transcription
app.post('/transcribe', upload.single('file'), async (req, res) => {
  const audioBuffer = req.file?.buffer; // Audio data from the uploaded file
  if (!audioBuffer) {
    return res.status(400).json({ error: 'Audio data is required.' });
  }

  const request = {
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
    },
    audio: {
      content: audioBuffer.toString('base64'),
    },
  };

  try {
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n');
    console.log({ transcription });
    res.json({ transcription });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
