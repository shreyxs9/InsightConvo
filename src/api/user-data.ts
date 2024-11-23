import { connectDB } from '../lib/mongodb';
import Meeting from '../models/Meeting';
import Resume from '../models/Resume';

export async function getUserData(meetingId: string) {
  await connectDB();

  // Find the meeting and get the user's email
  const meeting = await Meeting.findOne({ meetingId });
  if (!meeting) {
    throw new Error('Meeting not found');
  }

  // Get all meetings for this user
  const meetings = await Meeting.find({ email: meeting.email })
    .sort({ date: -1 })
    .lean();

  // Get the user's resume
  const resume = await Resume.findOne({ email: meeting.email }).lean();
  if (!resume) {
    throw new Error('Resume not found');
  }

  return {
    meetings,
    resume
  };
}