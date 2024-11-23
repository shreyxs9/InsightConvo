import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
  email: String,
  meetingId: String,
  date: Date,
  status: String,
  score: Number,
  position: String,
  insights: {
    confidence: Number,
    engagement: Number,
    clarity: Number,
    technicalKnowledge: Number,
    communicationSkills: Number,
    culturalFit: Number
  }
});

export default mongoose.models.Meeting || mongoose.model('Meeting', MeetingSchema);