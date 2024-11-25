import React from 'react';
import { BarChart, Users, Clock, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { useUserData } from '../hooks/useUserData';

const Dashboard = () => {
  const { userData, loading, error } = useUserData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading dashboard</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const latestMeeting =
    userData.meetings && userData.meetings.length > 0
      ? userData.meetings[0]
      : null;
  const totalInterviews = userData.meetings ? userData.meetings.length : 0;
  const avgScore =
    totalInterviews > 0
      ? Math.round(
          userData.meetings.reduce((acc, meeting) => acc + meeting.score, 0) / totalInterviews
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {userData.resume.name}</h1>
        <p className="text-gray-400">
          {userData.resume.position} • {userData.resume.experience} years of experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Interviews"
          value={totalInterviews.toString()}
          change="+12%"
          isPositive={true}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Avg. Duration"
          value="28m"
          change="-5%"
          isPositive={true}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="This Month"
          value={
            userData.meetings
              ? userData.meetings.filter(
                  (m) => new Date(m.date).getMonth() === new Date().getMonth()
                ).length.toString()
              : '0'
          }
          change="+8%"
          isPositive={true}
          icon={<Calendar className="h-6 w-6" />}
        />
        <StatCard
          title="Avg. Score"
          value={`${avgScore}%`}
          change="+3%"
          isPositive={true}
          icon={<BarChart className="h-6 w-6" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Recent Interviews</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3">Position</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {userData.meetings && userData.meetings.length > 0 ? (
                  userData.meetings.map((meeting) => (
                    <tr key={meeting.meetingId} className="border-b border-gray-700/50">
                      <td className="py-4">{meeting.position}</td>
                      <td className="py-4 text-gray-400">
                        {new Date(meeting.date).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                          {meeting.score}%
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded ${
                            meeting.status === 'Completed'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}
                        >
                          {meeting.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400">
                      No recent interviews
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Key Insights</h2>
          <div className="space-y-6">
            {latestMeeting ? (
              <>
                <InsightCard
                  title="Communication Skills"
                  value={latestMeeting.insights.communicationSkills}
                  trend="up"
                  description="Above average verbal clarity and engagement"
                />
                <InsightCard
                  title="Technical Knowledge"
                  value={latestMeeting.insights.technicalKnowledge}
                  trend="up"
                  description="Strong domain expertise demonstrated"
                />
                <InsightCard
                  title="Cultural Fit"
                  value={latestMeeting.insights.culturalFit}
                  trend="down"
                  description="Room for improvement in team alignment"
                />
              </>
            ) : (
              <p className="text-gray-400">No insights available for the latest meeting.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Skills & Education</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userData.resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Education</h3>
            <p className="text-gray-400">{userData.resume.education}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// The `StatCard` and `InsightCard` components remain the same

export default Dashboard;
