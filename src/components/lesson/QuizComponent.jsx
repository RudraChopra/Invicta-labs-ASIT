import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  Trophy,
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizComponent({ questions, onComplete, isCompleted }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswerSelect = (answerIndex) => {
    if (quizFinished) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    setQuizFinished(true);
    
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correct_answer
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    onComplete(score);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizFinished(false);
  };

  const getScore = () => {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correct_answer
    ).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const score = getScore();
    const passed = score >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
          passed ? 'bg-green-500' : 'bg-orange-500'
        }`}>
          {passed ? (
            <Trophy className="w-10 h-10 text-white" />
          ) : (
            <RotateCcw className="w-10 h-10 text-white" />
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          {passed ? 'Congratulations!' : 'Keep Learning!'}
        </h3>
        
        <p className="text-slate-600 mb-6">
          You scored <span className="font-bold text-2xl text-slate-800">{score}%</span>
        </p>
        
        {passed ? (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-lg px-4 py-2 mb-6">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Lesson Completed!
          </Badge>
        ) : (
          <div className="mb-6">
            <p className="text-orange-600 mb-4">
              You need 70% or higher to complete this lesson.
            </p>
            <Button 
              onClick={restartQuiz}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Answer Review */}
        <div className="mt-8 space-y-4 text-left">
          <h4 className="font-semibold text-slate-800">Review Your Answers:</h4>
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correct_answer;
            
            return (
              <Card key={index} className={`${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 mb-2">{question.question}</p>
                      <p className="text-sm text-slate-600 mb-1">
                        Your answer: <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                          {question.options[userAnswer]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-slate-600 mb-2">
                          Correct answer: <span className="text-green-700">
                            {question.options[question.correct_answer]}
                          </span>
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-slate-500 italic">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="font-medium text-slate-800">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                {questions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={nextQuestion}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}