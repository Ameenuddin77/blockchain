
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

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
  questions: Question[];
}

interface QuizResult {
  quizId: string;
  score: number;
  answers: {[key: number]: number};
  completedAt: string;
  userId: string;
}

const QuizEvaluation = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  // Sample quiz data (same as QuizAttempt)
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Blockchain Fundamentals',
      description: 'Test your knowledge about blockchain basics',
      difficulty: 'Easy',
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
    }

    // Get quiz result from localStorage
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    const userEmail = JSON.parse(localStorage.getItem('userData') || '{}').email;
    const userResult = results.find((r: QuizResult) => 
      r.quizId === quizId && r.userId === userEmail
    );
    
    if (userResult) {
      setResult(userResult);
    }
  }, [quizId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { message: "Outstanding! 🏆", emoji: "🎉" };
    if (score >= 80) return { message: "Excellent work! 🌟", emoji: "👏" };
    if (score >= 70) return { message: "Good job! 👍", emoji: "😊" };
    if (score >= 60) return { message: "Not bad, keep learning! 📚", emoji: "💪" };
    return { message: "Keep practicing! 🔥", emoji: "📖" };
  };

  if (!quiz || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading results...</div>
      </div>
    );
  }

  const correctAnswers = quiz.questions.filter((q, index) => 
    result.answers[index] === q.correctAnswer
  ).length;

  const performance = getPerformanceMessage(result.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
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
              <h1 className="ml-3 text-2xl font-bold text-white">Quiz Results</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Score Overview */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white">{quiz.title}</CardTitle>
            <CardDescription className="text-blue-200">Quiz completed successfully!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div>
                <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
                  {result.score.toFixed(1)}%
                </div>
                <Badge className={`${getScoreBadgeColor(result.score)} text-white text-lg px-4 py-2`}>
                  {correctAnswers}/{quiz.questions.length} Correct
                </Badge>
              </div>

              <div className="text-2xl text-white">
                {performance.message} {performance.emoji}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-blue-400 text-sm">Total Questions</div>
                  <div className="text-white text-2xl font-bold">{quiz.questions.length}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-green-400 text-sm">Correct Answers</div>
                  <div className="text-white text-2xl font-bold">{correctAnswers}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-red-400 text-sm">Wrong Answers</div>
                  <div className="text-white text-2xl font-bold">{quiz.questions.length - correctAnswers}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Detailed Results</CardTitle>
            <CardDescription className="text-blue-200">
              Review your answers and see the correct solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = result.answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border border-white/20 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-lg">
                      Question {index + 1}
                    </h3>
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-400" />
                    )}
                  </div>
                  
                  <p className="text-blue-200 mb-4">{question.question}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => {
                      let bgColor = 'bg-white/5';
                      let textColor = 'text-gray-300';
                      let borderColor = 'border-white/20';
                      
                      if (optIndex === question.correctAnswer) {
                        bgColor = 'bg-green-500/20';
                        textColor = 'text-green-400';
                        borderColor = 'border-green-500/30';
                      } else if (optIndex === userAnswer && !isCorrect) {
                        bgColor = 'bg-red-500/20';
                        textColor = 'text-red-400';
                        borderColor = 'border-red-500/30';
                      }
                      
                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded border ${bgColor} ${borderColor}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={textColor}>{option}</span>
                            <div className="flex items-center space-x-2">
                              {optIndex === userAnswer && (
                                <Badge variant="outline" className="text-xs">
                                  Your Answer
                                </Badge>
                              )}
                              {optIndex === question.correctAnswer && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  Correct
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate(`/quiz/${quizId}`)}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            disabled={true}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz (Not Allowed)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizEvaluation;
