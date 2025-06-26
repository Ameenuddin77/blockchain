
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number;
  questions: Question[];
}

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Sample quiz data (in real app, this would come from blockchain)
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Blockchain Fundamentals',
      description: 'Test your knowledge about blockchain basics',
      difficulty: 'Easy',
      timeLimit: 15,
      questions: [
        {
          id: '1',
          question: 'What is a blockchain?',
          options: [
            'A type of database',
            'A distributed ledger technology',
            'A programming language',
            'A web browser'
          ],
          correctAnswer: 1
        },
        {
          id: '2',
          question: 'Who created Bitcoin?',
          options: [
            'Vitalik Buterin',
            'Satoshi Nakamoto',
            'Elon Musk',
            'Bill Gates'
          ],
          correctAnswer: 1
        },
        {
          id: '3',
          question: 'What is mining in blockchain?',
          options: [
            'Extracting gold',
            'Creating new blocks',
            'Buying cryptocurrency',
            'Selling tokens'
          ],
          correctAnswer: 1
        }
      ]
    }
  ];

  useEffect(() => {
    // Find quiz by ID
    const foundQuiz = sampleQuizzes.find(q => q.id === quizId);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      setTimeLeft(foundQuiz.timeLimit * 60); // Convert minutes to seconds
    } else {
      toast.error('Quiz not found!');
      navigate('/dashboard');
    }
  }, [quizId, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / quiz.questions.length) * 100;
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    setIsSubmitting(true);

    // Simulate blockchain transaction
    setTimeout(() => {
      const score = calculateScore();
      const result = {
        quizId: quiz.id,
        score: score,
        answers: selectedAnswers,
        completedAt: new Date().toISOString(),
        userId: JSON.parse(localStorage.getItem('userData') || '{}').email
      };

      // Store result in localStorage (in real app, this would be on blockchain)
      const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      existingResults.push(result);
      localStorage.setItem('quizResults', JSON.stringify(existingResults));

      setIsSubmitting(false);
      toast.success(`Quiz submitted! Score: ${score.toFixed(1)}%`);
      navigate(`/evaluate/${quizId}`);
    }, 2000);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    toast.success('Quiz started! Good luck!');
  };

  if (!quiz) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white">Loading quiz...</div>
    </div>;
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-white/10 mr-4"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Button>
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-2xl font-bold text-white">Quiz Attempt</h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="backdrop-blur-lg bg-white/10 border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">{quiz.title}</CardTitle>
              <CardDescription className="text-blue-200">{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Badge className="bg-blue-500 text-white mb-2">Questions</Badge>
                  <p className="text-white text-lg">{quiz.questions.length}</p>
                </div>
                <div>
                  <Badge className="bg-green-500 text-white mb-2">Time Limit</Badge>
                  <p className="text-white text-lg">{quiz.timeLimit} minutes</p>
                </div>
              </div>

              <div className="text-center">
                <Badge className="bg-yellow-500 text-white">{quiz.difficulty}</Badge>
              </div>

              <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                <h3 className="text-orange-400 font-semibold mb-2">Instructions:</h3>
                <ul className="text-orange-200 text-sm space-y-1">
                  <li>• You have {quiz.timeLimit} minutes to complete this quiz</li>
                  <li>• Each question has only one correct answer</li>
                  <li>• You can navigate between questions</li>
                  <li>• Quiz will auto-submit when time expires</li>
                  <li>• You can only attempt this quiz once</li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-3"
                >
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header with Timer */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">{quiz.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="outline" className="border-white/20 text-white">
                {currentQuestion + 1} / {quiz.questions.length}
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white/10 h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Question {currentQuestion + 1}
            </CardTitle>
            <CardDescription className="text-blue-200 text-lg">
              {currentQ.question}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                  className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'bg-blue-500/30 border-blue-500 text-white'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 border-2 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-white/40'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Previous
              </Button>

              <div className="flex space-x-3">
                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizAttempt;
