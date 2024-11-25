import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Video, BarChart3, Eye, Mic, Smile } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Transform Your Hiring Process with AI
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          InsightConvo uses advanced AI to analyze candidate responses, emotions, and behavior
          in real-time, helping you make better hiring decisions.
        </p>
        <button
          onClick={() => navigate('/interview')}
          className="mt-8 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-full font-semibold text-lg transition-colors"
        >
          Start Interview
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon={<Eye className="h-8 w-8 text-blue-400" />}
          title="Eye Movement Analysis"
          description="Track candidate engagement and attention patterns through advanced eye-tracking technology."
        />
        <FeatureCard
          icon={<Mic className="h-8 w-8 text-purple-400" />}
          title="Voice Analysis"
          description="Analyze tone, confidence, and speech patterns to gain deeper insights into responses."
        />
        <FeatureCard
          icon={<Smile className="h-8 w-8 text-green-400" />}
          title="Emotion Detection"
          description="Understand candidate emotions and reactions throughout the interview process."
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl" />
        <div className="relative bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step number={1} title="Set Up Interview" description="Configure your interview questions and assessment criteria." />
            <Step number={2} title="Conduct Interview" description="AI analyzes responses and behavior in real-time." />
            <Step number={3} title="Get Insights" description="Receive detailed analysis and recommendations." />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Step = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

export default Home;