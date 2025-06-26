
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const CreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    difficulty: '',
    timeLimit: 30
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quizData.title || !quizData.description || !quizData.difficulty) {
      toast.error('Please fill all quiz details!');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question!');
      return;
    }

    const incompleteQuestions = questions.some(q => 
      !q.question || q.options.some(opt => !opt.trim())
    );

    if (incompleteQuestions) {
      toast.error('Please complete all questions and options!');
      return;
    }

    setIsSubmitting(true);

    // Simulate blockchain transaction
    setTimeout(() => {
      const newQuiz = {
        id: Date.now().toString(),
        ...quizData,
        questions: questions,
        createdAt: new Date().toISOString(),
        creator: JSON.parse(localStorage.getItem('userData') || '{}').email
      };

      // Store quiz in localStorage (in real app, this would be on blockchain)
      const existingQuizzes = JSON.parse(localStorage.getItem('createdQuizzes') || '[]');
      existingQuizzes.push(newQuiz);
      localStorage.setItem('createdQuizzes', JSON.stringify(existingQuizzes));

      setIsSubmitting(false);
      toast.success('Quiz created successfully on blockchain!');
      navigate('/dashboard');
    }, 2000);
  };

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
              <h1 className="ml-3 text-2xl font-bold text-white">Create Quiz</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Details */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quiz Details</CardTitle>
              <CardDescription className="text-blue-200">
                Basic information about your quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Quiz Title</Label>
                <Input
                  id="title"
                  value={quizData.title}
                  onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                  placeholder="Enter quiz title"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Input
                  id="description"
                  value={quizData.description}
                  onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                  placeholder="Brief description of the quiz"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
                  <Select onValueChange={(value) => setQuizData({...quizData, difficulty: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeLimit" className="text-white">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="5"
                    max="180"
                    value={quizData.timeLimit}
                    onChange={(e) => setQuizData({...quizData, timeLimit: parseInt(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Questions</CardTitle>
                  <CardDescription className="text-blue-200">
                    Add questions for your quiz
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="border border-white/20 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <Label className="text-white">Question {qIndex + 1}</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    placeholder="Enter your question"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === optIndex}
                          onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                          className="text-green-500"
                        />
                        <Input
                          value={option}
                          onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-blue-200">Select the correct answer by clicking the radio button</p>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No questions added yet. Click "Add Question" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3"
            >
              {isSubmitting ? 'Creating Quiz on Blockchain...' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
