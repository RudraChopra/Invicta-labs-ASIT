import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Zap, Brain, Rocket, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const tiers = [
  {
    name: "Basic",
    price: "Free",
    tier: "basic",
    description: "Start your journey with foundational concepts",
    features: [
      "Python fundamentals",
      "Basic AI concepts",
      "Interactive quizzes & badges",
      "AI mentor chatbot"
    ],
    icon: Brain,
    color: "from-slate-600 to-slate-800"
  },
  {
    name: "Pro",
    price: "$50/month",
    tier: "pro",
    description: "Build a strong portfolio with advanced projects",
    features: [
      "Everything in Basic",
      "Advanced AI projects (YOLO)",
      "Deploy models on Jetson Nano",
      "Peer project reviews"
    ],
    icon: Zap,
    color: "from-cyan-500 to-blue-600"
  },
  {
    name: "Expert",
    price: "$200/month",
    tier: "expert",
    description: "Engage in real-world consulting",
    features: [
      "Everything in Pro",
      "Live consulting projects",
      "Industry mentor access",
      "Revenue sharing opportunities"
    ],
    icon: Crown,
    color: "from-purple-500 to-pink-600"
  }
];

export default function Subscription() {
  const [userData, setUserData] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setUserData(user);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const handleUpgrade = async (tier) => {
    setIsUpgrading(tier);
    try {
      await User.updateMyUserData({ subscription_tier: tier });
      await loadUserData();
      // Simulate payment processing and then show success
      setTimeout(() => {
        setIsUpgrading(null);
        navigate(createPageUrl("Dashboard"));
      }, 2000);
    } catch (error) {
      console.error("Failed to upgrade tier:", error);
      setIsUpgrading(null);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const currentTierIndex = tiers.findIndex(t => t.tier === (userData?.subscription_tier || 'basic'));

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Unlock Your Potential
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose the plan that's right for your AI career ambitions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => {
            const isCurrent = tier.tier === (userData?.subscription_tier || 'basic');
            const isDowngrade = index < currentTierIndex;
            const Icon = tier.icon;
            
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden transition-all duration-300 h-full flex flex-col ${
                  isCurrent ? 'ring-2 ring-cyan-500 shadow-xl shadow-cyan-500/20' : 'hover:shadow-xl'
                }`}>
                  {isCurrent && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center py-2 text-sm font-semibold">
                      Current Plan
                    </div>
                  )}
                  
                  <CardHeader className={`text-center pt-12`}>
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                      {tier.name}
                    </CardTitle>
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {tier.price}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed h-12">
                      {tier.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-grow flex flex-col">
                    <ul className="space-y-3 mb-8 flex-grow">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => handleUpgrade(tier.tier)}
                      disabled={isCurrent || isDowngrade || isUpgrading}
                      className={`w-full font-semibold py-3 text-white shadow-lg transition-all duration-300 ${
                        isCurrent || isDowngrade 
                          ? 'bg-slate-400 cursor-not-allowed' 
                          : `${tier.color} hover:shadow-xl`
                      }`}
                    >
                      {isUpgrading === tier.tier ? (
                        <div className="flex items-center justify-center">
                          <Rocket className="w-5 h-5 mr-2 animate-ping" />
                          Upgrading...
                        </div>
                      ) : isCurrent ? 'Your Plan' : isDowngrade ? 'Unavailable' : 'Upgrade Plan'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}