
import React, { useState, useEffect, useRef } from "react";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles,
  Lock,
  Crown,
  Zap,
  Code,
  Brain,
  Lightbulb,
  AlertCircle,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const suggestedQuestions = [
  {
    icon: Code,
    text: "How do I implement a neural network in Python?",
    category: "Python"
  },
  {
    icon: Brain,
    text: "What's the difference between supervised and unsupervised learning?",
    category: "AI Concepts"
  },
  {
    icon: Zap,
    text: "Can you help me debug this YOLO detection code?",
    category: "Computer Vision"
  },
  {
    icon: Lightbulb,
    text: "What are the best practices for training deep learning models?",
    category: "Best Practices"
  }
];

export default function AIMentor() {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadUserData();
    loadWelcomeMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setUserData(user);
    } catch (error) {
      console.error("Error loading user data:", error);
      // Allow proceeding as the feature is free
    }
    setIsLoading(false);
  };

  const loadWelcomeMessage = () => {
    const welcomeMessage = {
      id: 'welcome',
      type: 'ai',
      content: `👋 Hello! I'm your AI mentor, powered by advanced language models to help you master artificial intelligence.

I can assist you with:
• Python programming concepts and debugging
• Machine learning algorithms and theory
• Deep learning and neural networks
• Computer vision and YOLO implementations
• Best practices and project guidance
• Career advice in AI/ML

What would you like to learn about today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const hasAccess = () => {
    // AI Mentor is now free for all users.
    return true;
  };

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isSending) return;
    if (!hasAccess()) return; // This check will now always pass

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      // Create context from recent messages
      const recentMessages = messages.slice(-5).map(msg => 
        `${msg.type === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');

      const contextualPrompt = `You are an expert AI mentor helping students learn artificial intelligence, machine learning, and Python programming. You are knowledgeable, encouraging, and provide practical, actionable advice.

Context from recent conversation:
${recentMessages}

Current question: ${messageText}

Please provide a helpful, detailed response that:
1. Directly answers the question
2. Includes practical examples when relevant
3. Suggests next steps or related concepts to explore
4. Uses a supportive, educational tone
5. If code is mentioned, provide clean, commented examples

Keep responses focused and educational, around 200-400 words.`;

      const response = await InvokeLLM({
        prompt: contextualPrompt,
        add_context_from_internet: false
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const formatMessage = (content) => {
    // Simple formatting for code blocks and bullet points
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('```')) {
          return null; // Skip code block markers for now
        }
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-2 my-1">
              <span className="text-blue-500 mt-1">•</span>
              <span>{line.substring(2)}</span>
            </div>
          );
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <div key={index} className="my-1">{line}</div>;
      });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Card className="h-96">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // This block is now effectively disabled but kept for potential future use.
  if (!hasAccess()) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8">
              AI Mentor
            </h1>

            <Card className="text-center py-16 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  AI Mentor Access Required
                </h2>
                <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Unlock personalized AI mentorship with Pro or Expert tier access. Get instant help with Python, machine learning, and AI project guidance from our advanced AI mentor.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-800 mb-2">Pro Tier</h3>
                    <p className="text-sm text-slate-600">AI mentor + advanced projects</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">$50/month</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <Crown className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-800 mb-2">Expert Tier</h3>
                    <p className="text-sm text-slate-600">Everything + live consulting</p>
                    <p className="text-lg font-bold text-purple-600 mt-2">$200/month</p>
                  </div>
                </div>

                <Link to={createPageUrl("Home")}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 text-lg font-semibold shadow-lg">
                    Upgrade Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                AI Mentor
              </h1>
              <p className="text-slate-600">Your personal AI learning assistant</p>
            </div>
            {/* Removed the subscription tier badge */}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl h-[600px] flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.type === 'ai' && (
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        
                        <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : ''}`}>
                          <div className={`p-4 rounded-2xl ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-4'
                              : message.isError
                              ? 'bg-red-50 border border-red-200 text-red-800'
                              : 'bg-slate-50 border border-slate-200 text-slate-800'
                          }`}>
                            <div className="text-sm leading-relaxed">
                              {typeof message.content === 'string' ? formatMessage(message.content) : message.content}
                            </div>
                            
                            {message.type === 'ai' && !message.isError && (
                              <div className="flex justify-end mt-3 pt-2 border-t border-slate-200">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyMessage(message.id, message.content)}
                                  className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
                                >
                                  {copiedMessageId === message.id ? (
                                    <Check className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <div className={`text-xs text-slate-500 mt-1 ${
                            message.type === 'user' ? 'text-right mr-4' : 'ml-1'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {message.type === 'user' && (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isSending && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 justify-start"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-slate-500">AI mentor is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input */}
              <div className="border-t border-slate-200 p-4">
                <div className="flex gap-3">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about AI, Python, or machine learning..."
                    className="flex-1 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isSending}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isSending}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleSendMessage(question.text)}
                    disabled={isSending}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <question.icon className="w-4 h-4 text-slate-600 mt-0.5 group-hover:text-blue-600 transition-colors" />
                      <div>
                        <p className="text-sm font-medium text-slate-800 group-hover:text-blue-800 transition-colors">
                          {question.text}
                        </p>
                        <p className="text-xs text-slate-500">{question.category}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                  <AlertCircle className="w-5 h-5" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Be specific about your coding problems for better help</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Ask follow-up questions to dive deeper into topics</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Request examples and practical applications</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
