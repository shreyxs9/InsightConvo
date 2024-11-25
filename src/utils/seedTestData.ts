import mongoose from 'mongoose';
import Meeting from '../models/Meeting';
import Resume from '../models/Resume';

const MONGODB_URI = 'mongodb+srv://21d12chaithanya:FyO6JsIDpypOTjl9@cluster0.1m7tq.mongodb.net/test';

async function seedTestData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test meeting
    const testMeeting = await Meeting.create({
      email: 'test@example.com',
      meetingId: 'TEST123',
      date: new Date(),
      status: 'Completed',
      score: 85,
      position: 'Senior Developer',
      insights: {
        confidence: 90,
        engagement: 85,
        clarity: 88,
        technicalKnowledge: 92,
        communicationSkills: 87,
        culturalFit: 89
      }
    });

    // Create test resume
    const testResume = await Resume.create({
      email: 'test@example.com',
      name: 'John Doe',
      position: 'Senior Developer',
      experience: 5,
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB'],
      education: 'Master of Computer Science, Stanford University'
    });

    console.log('Test data created successfully');
    console.log('Meeting ID:', testMeeting.meetingId);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding test data:', error);
  }
}

seedTestData();