
import React, { useState, useEffect } from "react";
import { Lesson, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Code,
  BookOpen,
  Trophy,
  Target,
  Play,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

import QuizComponent from "../components/lesson/QuizComponent";
import CodeExample from "../components/lesson/CodeExample";

export default function LessonPage() {
  const [lesson, setLesson] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const lessonId = urlParams.get('id');
  const moduleSlug = urlParams.get('module_slug'); // Changed from moduleId

  useEffect(() => {
    if (lessonId) {
      loadLessonData();
    }
  }, [lessonId]);

  const loadLessonData = async () => {
    try {
      const user = await User.me();
      setUserData(user);
      
      const lessonData = await Lesson.list();
      const currentLesson = lessonData.find(l => l.id === lessonId);
      setLesson(currentLesson);
      
      const completed = user?.completed_lessons?.includes(lessonId) || false;
      setIsCompleted(completed);
    } catch (error) {
      console.error("Error loading lesson:", error);
    }
    setIsLoading(false);
  };

  const markLessonComplete = async () => {
    try {
      if (!userData?.completed_lessons?.includes(lessonId)) {
        const updatedLessons = [...(userData.completed_lessons || []), lessonId];
        await User.updateMyUserData({ 
          completed_lessons: updatedLessons,
          total_points: (userData.total_points || 0) + 50
        });
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  };

  const handleQuizComplete = async (score) => {
    setQuizCompleted(true);
    if (score >= 70) { // Passing grade
      await markLessonComplete();
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-600 mb-4">Lesson Not Found</h2>
          <p className="text-slate-500 mb-8">The requested lesson could not be found.</p>
          <Link to={createPageUrl(`Module?slug=${moduleSlug}`)}> {/* Changed to moduleSlug */}
            <Button>Back to Module</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link to={createPageUrl(`Module?slug=${moduleSlug}`)}> {/* Changed to moduleSlug */}
              <Button variant="ghost" size="icon" className="hover:bg-white/50">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.estimated_duration || '15 min read'}</span>
                </div>
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lesson Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown 
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-slate-800 mb-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-slate-700 mb-4 mt-8" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-slate-700 mb-3 mt-6" {...props} />,
                    p: ({node, ...props}) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="text-slate-600 mb-4 pl-6" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? 
                        <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono text-sm" {...props} /> :
                        <code className="block bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto" {...props} />,
                    blockquote: ({node, ...props}) => 
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 text-blue-800 italic" {...props} />
                  }}
                >
                  {lesson.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Code Examples */}
        {lesson.code_examples && lesson.code_examples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Code className="w-6 h-6 text-blue-600" />
              Code Examples
            </h3>
            <div className="space-y-6">
              {lesson.code_examples.map((example, index) => (
                <CodeExample key={index} example={example} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Quiz Section */}
        {lesson.quiz_questions && lesson.quiz_questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <Target className="w-6 h-6" />
                  Knowledge Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showQuiz ? (
                  <div className="text-center py-8">
                    <p className="text-blue-700 mb-6">
                      Test your understanding with a quick quiz. Score 70% or higher to complete this lesson.
                    </p>
                    <Button 
                      onClick={() => setShowQuiz(true)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  </div>
                ) : (
                  <QuizComponent 
                    questions={lesson.quiz_questions}
                    onComplete={handleQuizComplete}
                    isCompleted={quizCompleted}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-between items-center"
        >
          <Link to={createPageUrl(`Module?slug=${moduleSlug}`)}> {/* Changed to moduleSlug */}
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Module
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            {!isCompleted && (!lesson.quiz_questions?.length || lesson.quiz_questions.length === 0) && (
              <Button 
                onClick={markLessonComplete}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Mark Complete
              </Button>
            )}
            
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Lesson Completed! +50 points
              </Badge>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
