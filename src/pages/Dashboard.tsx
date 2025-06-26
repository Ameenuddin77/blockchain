
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, Play, Wallet, CheckCircle, AlertCircle, User, Trophy, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WalletConnection from '@/components/WalletConnection';
import QuizCard from '@/components/QuizCard';

interface UserData {
  name: string;
  email: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  maxAttempts: number;
  completed: boolean;
  creator?: string;
  createdAt?: string;
  timeLimit?: number;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  // Sample quiz data
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Blockchain Fundamentals',
      description: 'Test your knowledge about blockchain basics and concepts',
      questions: [],
      difficulty: 'Easy',
      attempts: 0,
      maxAttempts: 1,
      completed: false
    },
    {
      id: '2',
      title: 'Smart Contracts Deep Dive',
      description: 'Advanced quiz on smart contract development and deployment',
      questions: [],
      difficulty: 'Hard',
      attempts: 1,
      maxAttempts: 1,
      completed: true
    },
    {
      id: '3',
      title: 'DeFi Protocols',
      description: 'Understanding decentralized finance and its protocols',
      questions: [],
      difficulty: 'Medium',
      attempts: 0,
      maxAttempts: 1,
      completed: false
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    // Get user data
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Check wallet connection status
    const walletConnected = localStorage.getItem('walletConnected');
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (walletConnected && storedWalletAddress) {
      setIsWalletConnected(true);
      setWalletAddress(storedWalletAddress);
    }

    // Load created quizzes from localStorage
    loadQuizzes();
  }, [navigate]);

  const loadQuizzes = () => {
    const createdQuizzes = JSON.parse(localStorage.getItem('createdQuizzes') || '[]');
    
    // Transform created quizzes to match our Quiz interface
    const transformedCreatedQuizzes = createdQuizzes.map((quiz: any) => ({
      ...quiz,
      questions: quiz.questions || [],
      attempts: 0,
      maxAttempts: 1,
      completed: false
    }));

    // Combine sample quizzes with created quizzes
    const allQuizzes = [...sampleQuizzes, ...transformedCreatedQuizzes];
    setQuizzes(allQuizzes);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    navigate('/');
  };

  const handleQuizAction = (action: string, quizId?: string) => {
    if (!isWalletConnected) {
      alert('Please connect your MetaMask wallet first to access quiz features!');
      return;
    }

    switch (action) {
      case 'create':
        navigate('/create-quiz');
        break;
      case 'attempt':
        navigate(`/quiz/${quizId}`);
        break;
      case 'evaluate':
        navigate(`/evaluate/${quizId}`);
        break;
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const completedQuizzes = quizzes.filter(quiz => quiz.completed).length;
  const totalQuizzes = quizzes.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-white">QuizChain</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <WalletConnection 
                isConnected={isWalletConnected}
                walletAddress={walletAddress}
                onConnectionChange={(connected, address) => {
                  setIsWalletConnected(connected);
                  setWalletAddress(address);
                }}
              />
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* User Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{userData.name}</CardTitle>
                <CardDescription className="text-blue-200">{userData.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-200">Wallet Status:</span>
                  <Badge variant={isWalletConnected ? "default" : "secondary"} className={isWalletConnected ? "bg-green-500" : "bg-red-500"}>
                    {isWalletConnected ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-200">Quizzes Completed:</span>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {completedQuizzes}/{totalQuizzes}
                  </Badge>
                </div>

                <div className="pt-4">
                  <div className="flex items-center text-sm text-blue-200 mb-2">
                    <Trophy className="h-4 w-4 mr-2" />
                    Progress
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome back, {userData.name.split(' ')[0]}! 👋
              </h2>
              <p className="text-blue-200 text-lg">
                Ready to test your blockchain knowledge?
              </p>
            </div>

            {/* Wallet Connection Alert */}
            {!isWalletConnected && (
              <Card className="backdrop-blur-lg bg-red-500/20 border-red-500/30">
                <CardContent className="flex items-center p-6">
                  <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-white font-medium">MetaMask Wallet Required</p>
                    <p className="text-red-200 text-sm">Connect your wallet to create, attempt, or evaluate quizzes</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button
                onClick={() => handleQuizAction('create')}
                className="h-24 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                disabled={!isWalletConnected}
              >
                <div className="flex flex-col items-center">
                  <Plus className="h-8 w-8 mb-2" />
                  Create Quiz
                </div>
              </Button>

              <Button
                onClick={() => alert('Select a quiz below to attempt')}
                className="h-24 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold"
                disabled={!isWalletConnected}
              >
                <div className="flex flex-col items-center">
                  <Play className="h-8 w-8 mb-2" />
                  Attempt Quiz
                </div>
              </Button>

              <Button
                onClick={() => alert('Select a completed quiz to evaluate')}
                className="h-24 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                disabled={!isWalletConnected}
              >
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-8 w-8 mb-2" />
                  Evaluate Quiz
                </div>
              </Button>
            </div>

            {/* Available Quizzes */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Available Quizzes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={{
                      ...quiz,
                      questions: Array.isArray(quiz.questions) ? quiz.questions.length : 0
                    }}
                    isWalletConnected={isWalletConnected}
                    onAttempt={() => handleQuizAction('attempt', quiz.id)}
                    onEvaluate={() => handleQuizAction('evaluate', quiz.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
