
import React, { useState, useEffect } from "react";
import { Module, Lesson, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Play,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Target,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

export default function ModulePage() {
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const moduleSlug = urlParams.get('slug');

  useEffect(() => {
    if (moduleSlug) {
      loadModuleData();
    }
  }, [moduleSlug]);

  const loadModuleData = async () => {
    try {
      const user = await User.me();
      setUserData(user);

      const moduleList = await Module.filter({ slug: moduleSlug });
      if (moduleList.length > 0) {
        const currentModule = moduleList[0];
        setModule(currentModule);
        const lessonData = await Lesson.filter({ module_slug: moduleSlug }, 'order_index');
        setLessons(lessonData);
      }
    } catch (error) {
      console.error("Error loading module:", error);
    }
    setIsLoading(false);
  };

  const isLessonCompleted = (lessonId) => {
    return userData?.completed_lessons?.includes(lessonId) || false;
  };

  const getModuleProgress = () => {
    if (!lessons.length) return 0;
    const completedCount = lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
    return (completedCount / lessons.length) * 100;
  };

  const canAccessModule = () => {
    if (!module) return false;
    const tierLevels = { basic: 1, pro: 2, expert: 3 };
    const userTier = userData?.subscription_tier || 'basic';
    return tierLevels[userTier] >= tierLevels[module.required_tier];
  };

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-48 bg-slate-200 rounded-xl"></div>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-600 mb-4">Module Not Found</h2>
          <p className="text-slate-500 mb-8">The requested module could not be found.</p>
          <Link to={createPageUrl("Curriculum")}>
            <Button>Back to Curriculum</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!canAccessModule()) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Upgrade Required</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            This module requires {module.required_tier} tier access. Upgrade your subscription to unlock advanced AI learning content.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to={createPageUrl("Curriculum")}>
              <Button variant="outline">Back to Curriculum</Button>
            </Link>
            <Link to={createPageUrl("Subscription")}>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                Upgrade Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link to={createPageUrl("Curriculum")}>
              <Button variant="ghost" size="icon" className="hover:bg-white/50">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {module.title}
              </h1>
              <p className="text-slate-600 text-lg">{module.description}</p>
            </div>
          </div>

          {/* Module Overview Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{lessons.length}</div>
                  <div className="text-sm text-slate-600">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{module.estimated_duration}</div>
                  <div className="text-sm text-slate-600">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{Math.round(getModuleProgress())}%</div>
                  <div className="text-sm text-slate-600">Complete</div>
                </div>
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
                    {module.difficulty}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Module Progress</span>
                  <span className="font-semibold text-slate-800">{Math.round(getModuleProgress())}%</span>
                </div>
                <Progress value={getModuleProgress()} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Lessons</h2>
          
          {lessons.map((lesson, index) => {
            const isCompleted = isLessonCompleted(lesson.id);
            const isAccessible = index === 0 || isLessonCompleted(lessons[index - 1]?.id);
            
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`transition-all duration-300 hover:shadow-lg ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
                    : isAccessible 
                    ? 'bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-xl' 
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isAccessible 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                            : 'bg-slate-300 text-slate-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <span className="font-bold text-lg">{index + 1}</span>
                          )}
                        </div>
                        
                        <div>
                          <CardTitle className="text-xl font-bold text-slate-800 mb-1">
                            {lesson.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {lesson.estimated_duration || '15 min'}
                            </div>
                            {lesson.quiz_questions?.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                Quiz included
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isAccessible ? (
                        <Link to={createPageUrl(`Lesson?id=${lesson.id}&module_slug=${moduleSlug}`)}>
                          <Button className={`${
                            isCompleted 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                          } shadow-lg hover:shadow-xl transition-all duration-300`}>
                            {isCompleted ? 'Review' : 'Start Lesson'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="opacity-50">
                          <span className="text-sm">Complete previous lesson</span>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
          
          {lessons.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Lessons Available</h3>
                <p className="text-slate-500">
                  Lessons for this module are being prepared. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
