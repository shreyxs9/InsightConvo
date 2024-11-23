import express from 'express';
import { SpeechClient } from '@google-cloud/speech';
import { PassThrough } from 'stream';

const router = express.Router();
const speechClient = new SpeechClient();

// Endpoint to handle real-time transcription
router.post('/transcribe', async (req, res) => {
  const audioBuffer = req.body.audio; // Base64 audio data
  const audioStream = new PassThrough();

  audioStream.end(Buffer.from(audioBuffer, 'base64'));

  const request = {
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
    audio: {
      content: audioBuffer,
    },
  };

  try {
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    res.json({ transcription });
  } catch (err) {
    console.error('Error transcribing audio:', err);
    res.status(500).json({ error: 'Transcription failed.' });
  }
});

export default router;
