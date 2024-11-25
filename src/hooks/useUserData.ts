import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export interface UserData {
  meetings: Array<{
    meetingId: string;
    date: Date;
    status: string;
    score: number;
    position: string;
    insights: {
      confidence: number;
      engagement: number;
      clarity: number;
      technicalKnowledge: number;
      communicationSkills: number;
      culturalFit: number;
    };
  }>;
  resume: {
    name: string;
    position: string;
    experience: number;
    skills: string[];
    education: string;
  };
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const meetingId = Cookies.get('meetingId');
        if (!meetingId) {
          throw new Error('No meeting ID found');
        }

        const response = await axios.get(`/api/user-data?meetingId=${meetingId}`);
        setUserData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
}