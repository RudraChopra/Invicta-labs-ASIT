import React, { useState, useEffect } from "react";
import { Badge as BadgeEntity, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Crown,
  Award,
  CheckCircle2,
  Lock,
  Flame,
  BookOpen,
  Code,
  Brain
} from "lucide-react";
import { motion } from "framer-motion";

const badgeIcons = {
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
  crown: Crown,
  award: Award,
  flame: Flame,
  book: BookOpen,
  code: Code,
  brain: Brain
};

const categoryColors = {
  completion: "from-blue-500 to-blue-600",
  streak: "from-orange-500 to-orange-600", 
  quiz: "from-green-500 to-green-600",
  project: "from-purple-500 to-purple-600",
  special: "from-pink-500 to-pink-600"
};

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBadgesData();
  }, []);

  const loadBadgesData = async () => {
    try {
      const user = await User.me();
      setUserData(user);
      
      const allBadges = await BadgeEntity.list();
      setBadges(allBadges);
    } catch (error) {
      console.error("Error loading badges:", error);
    }
    setIsLoading(false);
  };

  const isBadgeEarned = (badgeId) => {
    return userData?.badges_earned?.includes(badgeId) || false;
  };

  const getProgressTowardsBadge = (badge) => {
    // Mock progress calculation based on badge requirements
    if (!badge.requirements) return 0;
    
    switch (badge.requirements.type) {
      case 'lesson_completion':
        const completedLessons = userData?.completed_lessons?.length || 0;
        return Math.min((completedLessons / (badge.requirements.threshold || 1)) * 100, 100);
      case 'quiz_score':
        return Math.floor(Math.random() * 100);
      case 'streak':
        const streakDays = userData?.streak_days || 0;
        return Math.min((streakDays / (badge.requirements.threshold || 1)) * 100, 100);
      default:
        return Math.floor(Math.random() * 100);
    }
  };

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Badges', count: badges.length },
    { id: 'completion', name: 'Completion', count: badges.filter(b => b.category === 'completion').length },
    { id: 'streak', name: 'Streak', count: badges.filter(b => b.category === 'streak').length },
    { id: 'quiz', name: 'Quiz Master', count: badges.filter(b => b.category === 'quiz').length },
    { id: 'project', name: 'Projects', count: badges.filter(b => b.category === 'project').length },
    { id: 'special', name: 'Special', count: badges.filter(b => b.category === 'special').length }
  ];

  const totalEarned = userData?.badges_earned?.length || 0;
  const totalAvailable = badges.length;
  const overallProgress = totalAvailable > 0 ? (totalEarned / totalAvailable) * 100 : 0;

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
            Badge Collection
          </h1>
          <p className="text-slate-600 text-lg mb-6">
            Earn badges by completing lessons, maintaining streaks, and mastering skills
          </p>

          {/* Progress Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {totalEarned} of {totalAvailable} Badges Earned
                    </h3>
                    <p className="text-slate-600">Keep learning to unlock more!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-800">{Math.round(overallProgress)}%</div>
                  <div className="text-slate-600 text-sm">Complete</div>
                </div>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </CardContent>
          </Card>
          
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
                {category.name}
                <Badge variant="secondary" className="bg-white/20 text-current">
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Badges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge, index) => {
            const IconComponent = badgeIcons[badge.icon] || Award;
            const isEarned = isBadgeEarned(badge.id);
            const progress = getProgressTowardsBadge(badge);
            const gradientClass = categoryColors[badge.category] || "from-gray-500 to-gray-600";

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  isEarned 
                    ? 'ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/20 bg-gradient-to-br from-yellow-50 to-orange-50' 
                    : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  {isEarned && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {!isEarned && progress < 100 && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-slate-400 text-white p-2 rounded-full">
                        <Lock className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center shadow-lg ${
                      !isEarned ? 'opacity-50 grayscale' : 'animate-pulse'
                    }`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                      {badge.name}
                    </CardTitle>
                    
                    <Badge className={`${
                      isEarned 
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {badge.category.replace('_', ' ')}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-slate-600 text-sm mb-4 text-center leading-relaxed">
                      {badge.description}
                    </p>
                    
                    {isEarned ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                          <CheckCircle2 className="w-5 h-5" />
                          Badge Earned!
                        </div>
                        {badge.points_value && (
                          <p className="text-sm text-slate-600 mt-1">
                            +{badge.points_value} points
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-semibold text-slate-800">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        {badge.requirements && (
                          <p className="text-xs text-slate-500 text-center">
                            {badge.requirements.type === 'lesson_completion' && `Complete ${badge.requirements.threshold} lessons`}
                            {badge.requirements.type === 'quiz_score' && `Score ${badge.requirements.threshold}% on quizzes`}
                            {badge.requirements.type === 'streak' && `Maintain ${badge.requirements.threshold} day streak`}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredBadges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No badges found</h3>
            <p className="text-slate-500">
              {selectedCategory === 'all' 
                ? 'No badges available yet. Check back soon!' 
                : 'No badges in this category. Try selecting a different category.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}