
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Clock, AlertTriangle, Trophy } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  maxAttempts: number;
  completed: boolean;
}

interface QuizCardProps {
  quiz: Quiz;
  isWalletConnected: boolean;
  onAttempt: () => void;
  onEvaluate: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  quiz, 
  isWalletConnected, 
  onAttempt, 
  onEvaluate 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const canAttempt = quiz.attempts < quiz.maxAttempts && !quiz.completed;
  const hasAttemptsLeft = quiz.attempts < quiz.maxAttempts;

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{quiz.title}</CardTitle>
            <CardDescription className="text-blue-200">
              {quiz.description}
            </CardDescription>
          </div>
          
          {quiz.completed && (
            <Trophy className="h-6 w-6 text-yellow-500" />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge 
            className={`${getDifficultyColor(quiz.difficulty)} text-white`}
          >
            {quiz.difficulty}
          </Badge>
          
          <Badge variant="outline" className="border-white/20 text-white">
            {quiz.questions} Questions
          </Badge>
          
          {quiz.completed ? (
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Attempts Info */}
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">Attempts:</span>
            <span className="text-white">
              {quiz.attempts}/{quiz.maxAttempts}
            </span>
          </div>
          
          {/* Warning for max attempts */}
          {!hasAttemptsLeft && !quiz.completed && (
            <div className="flex items-center text-sm text-orange-400">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Maximum attempts reached
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            {canAttempt ? (
              <Button
                onClick={onAttempt}
                disabled={!isWalletConnected}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Attempt
              </Button>
            ) : quiz.completed ? (
              <Button
                onClick={onEvaluate}
                disabled={!isWalletConnected}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                View Results
              </Button>
            ) : (
              <Button
                disabled
                className="flex-1 bg-gray-500 text-gray-300 cursor-not-allowed"
              >
                No Attempts Left
              </Button>
            )}
          </div>
          
          {!isWalletConnected && (
            <p className="text-xs text-orange-400 text-center">
              Connect wallet to interact
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
