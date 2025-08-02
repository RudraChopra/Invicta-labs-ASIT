
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Crown, 
  Check, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const tiers = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for beginners starting their AI journey",
      features: [
        "Python fundamentals",
        "Basic AI concepts",
        "Interactive quizzes",
        "Badge system",
        "AI mentor chatbot",
        "Community access"
      ],
      icon: Brain,
      color: "from-slate-600 to-slate-800",
      buttonColor: "bg-slate-700 hover:bg-slate-800",
      tier: "basic"
    },
    {
      name: "Pro",
      price: "$50/month",
      description: "For advanced projects and portfolio building",
      features: [
        "Everything in Basic",
        "Advanced AI projects",
        "YOLO & Jetson Nano",
        "Project portfolio",
        "Peer reviews"
      ],
      icon: Zap,
      color: "from-cyan-500 to-blue-600",
      buttonColor: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
      popular: true,
      tier: "pro"
    },
    {
      name: "Expert",
      price: "$200/month",
      description: "Professional consulting and industry mentorship",
      features: [
        "Everything in Pro",
        "Live consulting projects",
        "Industry mentors",
        "Masterclass access",
        "Revenue sharing",
        "Priority support"
      ],
      icon: Crown,
      color: "from-purple-500 to-pink-600",
      buttonColor: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
      tier: "expert"
    }
  ];

  const stats = [
    { label: "Active Learners", value: "10K+", icon: Users },
    { label: "AI Projects", value: "500+", icon: Target },
    { label: "Success Rate", value: "95%", icon: Award },
    { label: "Industry Partners", value: "50+", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 to-blue-900/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-cyan-500" />
              <Badge className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-600 border-cyan-200">
                Next-Gen AI Education
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-800 to-slate-900 bg-clip-text text-transparent leading-tight">
              Master AI with
              <br />
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Invicta Labs ASIT
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              From Python basics to advanced AI consulting. Learn, build, and earn with our comprehensive AI education platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={createPageUrl("Dashboard")}>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 text-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
                  Start Learning Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("DemoLab")}>
                <Button variant="outline" className="px-8 py-4 text-lg font-semibold border-2 hover:bg-white/50">
                  Try Demo Lab
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-cyan-600" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Choose Your Learning Path
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From free fundamentals to professional consulting opportunities. Pick the tier that matches your ambitions.
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col ${
                  tier.popular ? 'ring-2 ring-cyan-500 shadow-xl shadow-cyan-500/20' : 'hover:shadow-xl'
                }`}>
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center py-2 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader className={`text-center ${tier.popular ? 'pt-12' : 'pt-8'}`}>
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <tier.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                      {tier.name}
                    </CardTitle>
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {tier.price}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {tier.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-grow flex flex-col">
                    <ul className="space-y-3 mb-8 flex-grow">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to={createPageUrl("Subscription")} className="block">
                      <Button className={`w-full ${tier.buttonColor} text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300`}>
                        {tier.name === "Basic" ? "Start Free" : `Upgrade to ${tier.name}`}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Join thousands of students who've launched successful AI careers with Invicta Labs ASIT.
            </p>
            <Link to={createPageUrl("Curriculum")}>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-10 py-4 text-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
                Explore Curriculum
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
