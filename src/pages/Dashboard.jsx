import React, { useState, useEffect } from "react";
import { User, Badge, Module } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Trophy, 
  BookOpen, 
  Target, 
  Flame, 
  Star,
  ArrowRight,
  Clock,
  CheckCircle2,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [modules, setModules] = useState([]);
  const [recentBadges, setRecentBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = await User.me();
      setUserData(user);
      
      const allModules = await Module.list('order_index');
      const availableModules = allModules.filter(module => 
        canAccessModule(module.required_tier, user.subscription_tier || 'basic')
      );
      setModules(availableModules);
      
      // Mock recent badges for now
      setRecentBadges([
        { name: "First Steps", color: "bg-blue-500", icon: "🎯" },
        { name: "Quiz Master", color: "bg-green-500", icon: "🧠" },
        { name: "Code Explorer", color: "bg-purple-500", icon: "💻" }
      ]);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setIsLoading(false);
  };

  const canAccessModule = (requiredTier, userTier) => {
    const tierLevels = { basic: 1, pro: 2, expert: 3 };
    return tierLevels[userTier] >= tierLevels[requiredTier];
  };

  const getCompletionPercentage = () => {
    if (!userData || !modules.length) return 0;
    const completedLessons = userData.completed_lessons?.length || 0;
    const totalLessons = modules.length * 5; // Approximate
    return Math.min((completedLessons / totalLessons) * 100, 100);
  };

  const getCurrentModule = () => {
    return modules.find(m => m.id === userData?.current_module) || modules[0];
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Welcome back, {userData?.full_name || 'Student'}!
          </h1>
          <p className="text-slate-600 text-lg">
            Continue your AI mastery journey
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Points</p>
                    <p className="text-2xl font-bold">{userData?.total_points || 0}</p>
                  </div>
                  <Star className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Badges Earned</p>
                    <p className="text-2xl font-bold">{userData?.badges_earned?.length || 0}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Streak Days</p>
                    <p className="text-2xl font-bold">{userData?.streak_days || 0}</p>
                  </div>
                  <Flame className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Completion</p>
                    <p className="text-2xl font-bold">{Math.round(getCompletionPercentage())}%</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Overall Completion</span>
                      <span className="font-semibold text-slate-800">{Math.round(getCompletionPercentage())}%</span>
                    </div>
                    <Progress value={getCompletionPercentage()} className="h-3" />
                    
                    {getCurrentModule() && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-800">Continue Learning</h4>
                            <p className="text-slate-600 text-sm">{getCurrentModule().title}</p>
                          </div>
                          <Link to={createPageUrl("Curriculum")}>
                            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                              Continue
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-cyan-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Link to={createPageUrl("Curriculum")}>
                      <Button variant="outline" className="w-full h-16 flex flex-col gap-1 hover:bg-blue-50 border-blue-200">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">View Curriculum</span>
                      </Button>
                    </Link>
                    <Link to={createPageUrl("Badges")}>
                      <Button variant="outline" className="w-full h-16 flex flex-col gap-1 hover:bg-green-50 border-green-200">
                        <Trophy className="w-5 h-5 text-green-600" />
                        <span className="text-sm">My Badges</span>
                      </Button>
                    </Link>
                    <Link to={createPageUrl("AIMentor")}>
                      <Button variant="outline" className="w-full h-16 flex flex-col gap-1 hover:bg-purple-50 border-purple-200">
                        <Target className="w-5 h-5 text-purple-600" />
                        <span className="text-sm">AI Mentor</span>
                      </Button>
                    </Link>
                    <Link to={createPageUrl("DemoLab")}>
                      <Button variant="outline" className="w-full h-16 flex flex-col gap-1 hover:bg-orange-50 border-orange-200">
                        <Flame className="w-5 h-5 text-orange-600" />
                        <span className="text-sm">Demo Lab</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <BadgeComponent className="bg-cyan-500/20 text-cyan-300 border-cyan-400">
                      {(userData?.subscription_tier || 'basic').toUpperCase()} TIER
                    </BadgeComponent>
                    <p className="text-slate-300 text-sm">
                      {userData?.subscription_tier === 'basic' && "Access to fundamental AI concepts"}
                      {userData?.subscription_tier === 'pro' && "Advanced projects + AI mentor"}
                      {userData?.subscription_tier === 'expert' && "Full access + consulting opportunities"}
                    </p>
                    <Link to={createPageUrl("Home")}>
                      <Button variant="outline" className="w-full text-white border-slate-600 hover:bg-slate-700">
                        Upgrade Plan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                    Recent Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentBadges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <div className={`w-10 h-10 ${badge.color} rounded-full flex items-center justify-center text-white text-lg`}>
                          {badge.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{badge.name}</p>
                          <p className="text-xs text-slate-600">Just earned!</p>
                        </div>
                      </div>
                    ))}
                    <Link to={createPageUrl("Badges")}>
                      <Button variant="ghost" className="w-full text-slate-600 hover:text-slate-800">
                        View All Badges
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}