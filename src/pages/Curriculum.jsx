
import React, { useState, useEffect } from "react";
import { Module, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Star,
  ArrowRight,
  Code,
  Brain,
  Zap,
  Crown,
  Target,
  Play
} from "lucide-react";
import { motion } from "framer-motion";

const moduleIcons = {
  'python-basics': Code,
  'ai-fundamentals': Brain,
  'advanced-ai': Zap,
  'consulting': Crown
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-orange-100 text-orange-800 border-orange-200",
  expert: "bg-red-100 text-red-800 border-red-200"
};

const tierColors = {
  basic: "bg-slate-100 text-slate-800",
  pro: "bg-blue-100 text-blue-800",
  expert: "bg-purple-100 text-purple-800"
};

export default function Curriculum() {
  const [modules, setModules] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurriculumData();
  }, []);

  const loadCurriculumData = async () => {
    try {
      const user = await User.me();
      setUserData(user);
      
      const allModules = await Module.list('order_index');
      setModules(allModules);
    } catch (error) {
      console.error("Error loading curriculum:", error);
    }
    setIsLoading(false);
  };

  const canAccessModule = (requiredTier, userTier = 'basic') => {
    const tierLevels = { basic: 1, pro: 2, expert: 3 };
    return tierLevels[userTier] >= tierLevels[requiredTier];
  };

  const getModuleProgress = (moduleId) => {
    // Mock progress calculation
    return Math.floor(Math.random() * 100);
  };

  const isModuleCompleted = (moduleId) => {
    return userData?.completed_lessons?.some(lessonId => lessonId.startsWith(moduleId)) || false;
  };

  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(module => module.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Modules', icon: Target },
    { id: 'python-basics', name: 'Python Basics', icon: Code },
    { id: 'ai-fundamentals', name: 'AI Fundamentals', icon: Brain },
    { id: 'advanced-ai', name: 'Advanced AI', icon: Zap },
    { id: 'consulting', name: 'Consulting', icon: Crown }
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            AI Curriculum
          </h1>
          <p className="text-slate-600 text-lg mb-6">
            Master artificial intelligence from fundamentals to advanced applications
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-md'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, index) => {
            const IconComponent = moduleIcons[module.category] || BookOpen;
            const hasAccess = canAccessModule(module.required_tier, userData?.subscription_tier);
            const progress = getModuleProgress(module.id);
            const isCompleted = isModuleCompleted(module.id);

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 h-full flex flex-col ${
                  !hasAccess ? 'opacity-75' : ''
                } ${isCompleted ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/10' : ''}`}>
                  {!hasAccess && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-slate-800/90 backdrop-blur-sm text-white p-2 rounded-full">
                        <Lock className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${module.color || 'from-blue-500 to-blue-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <CardTitle className="text-center text-xl font-bold text-slate-800 mb-2">
                      {module.title}
                    </CardTitle>
                    
                    <div className="flex justify-center gap-2 mb-3">
                      <Badge className={difficultyColors[module.difficulty]}>
                        {module.difficulty}
                      </Badge>
                      <Badge className={tierColors[module.required_tier]}>
                        {module.required_tier} tier
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed flex-grow">
                      {module.description}
                    </p>
                    
                    {hasAccess && (
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-semibold text-slate-800">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {module.estimated_duration || '2-3 hours'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        4.8 rating
                      </div>
                    </div>
                    
                    {hasAccess ? (
                      <Link to={createPageUrl(`Module?slug=${module.slug}`)}>
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-4">
                          {isCompleted ? 'Review Module' : progress > 0 ? 'Continue Learning' : 'Start Module'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Link to={createPageUrl("Subscription")}>
                        <Button variant="outline" className="w-full font-semibold border-2 hover:bg-slate-50 mt-4">
                          <Lock className="w-4 h-4 mr-2" />
                          Upgrade to Access
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No modules found</h3>
            <p className="text-slate-500">
              {selectedCategory === 'all' 
                ? 'No modules available yet. Check back soon!' 
                : 'No modules in this category. Try selecting a different category.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
