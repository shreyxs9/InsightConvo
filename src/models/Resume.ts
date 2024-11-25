import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  email: String,
  name: String,
  position: String,
  experience: Number,
  skills: [String],
  education: String
});

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);