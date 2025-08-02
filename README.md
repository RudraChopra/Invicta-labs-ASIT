Base44 AI
Base44
🚀 Invicta Labs ASIT - AI Education Platform
LicenseReactAI Powered

Advanced AI learning platform with interactive curriculum, real-time mentorship, and hands-on project experience.

Invicta Labs ASIT (Artificial Intelligence Skills and Innovation Training) is a comprehensive educational platform designed to take students from Python basics to advanced AI consulting. Built with modern web technologies and powered by cutting-edge AI models.

🎯 Features
🎓 Multi-Tier Learning System
Basic Tier (Free): Python fundamentals, AI concepts, quizzes, badges, AI mentor
Pro Tier ($50/month): Advanced projects, YOLO implementation, Jetson Nano deployment
Expert Tier ($200/month): Live consulting projects, industry mentorship, revenue sharing
🤖 AI-Powered Features
AI Mentor: 24/7 intelligent tutoring and code assistance
Live Demo Lab: Real-time license plate recognition showcase
Adaptive Learning: Personalized curriculum based on progress
Smart Quizzes: AI-generated questions with explanations
📚 Comprehensive Curriculum
Python Basics: Variables, functions, data structures, OOP
AI Fundamentals: Machine learning, neural networks, computer vision
Advanced AI: Deep learning, YOLO, deployment strategies
Consulting Skills: Real-world project management and client interaction
🏆 Gamification & Progress Tracking
Achievement badges and point system
Learning streaks and progress analytics
Peer reviews and community features
Portfolio building and project showcases
🛠️ Tech Stack
Frontend
- React 18+ with modern hooks
- Tailwind CSS for responsive design
- Shadcn/ui component library
- Framer Motion for animations
- Lucide React icons
- React Router for navigation
Backend & Infrastructure
- Base44 platform (managed backend)
- Entity-based data architecture
- Built-in authentication & user management
- File upload and storage
- Real-time AI integrations
AI & Machine Learning
- OpenAI GPT-4 integration
- Computer vision models
- Natural language processing
- Custom training pipelines
- Vector embeddings for content
🚀 Getting Started
Prerequisites
Node.js 18+ and npm/yarn
Base44 platform account
AI service API keys (for production)
Installation
# Clone the repository
git clone https://github.com/invicta-labs/asit.git
cd asit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys and configuration

# Start development server
npm run dev
Project Structure
src/
├── entities/           # Data models (User, Module, Lesson, Badge)
├── pages/             # Main application pages
├── components/        # Reusable UI components
├── integrations/      # AI service integrations
├── utils/            # Helper functions
└── Layout.js         # Main application layout
📖 Usage
For Students
Sign up for free Basic tier access
Complete modules in sequential order
Earn badges and track learning progress
Use AI Mentor for personalized help
Upgrade to unlock advanced projects
For Educators
Monitor student progress via admin dashboard
Create custom content using the module system
Track engagement with detailed analytics
Manage subscriptions and access levels
For Developers
// Example: Creating a new lesson
import { Lesson } from '@/entities/Lesson';

const newLesson = await Lesson.create({
  title: "Introduction to Neural Networks",
  module_slug: "ai-fundamentals",
  content: "# Neural Networks\n\nLearn the basics...",
  quiz_questions: [/* quiz data */],
  code_examples: [/* code samples */]
});
🧩 Key Components
AI Mentor System
// Real-time AI tutoring with context
const response = await InvokeLLM({
  prompt: "Explain neural networks to a beginner",
  add_context_from_internet: true,
  response_json_schema: { /* structured response */ }
});
Demo Lab Integration
// Live computer vision demo
const analysis = await InvokeLLM({
  prompt: "Analyze this license plate image",
  file_urls: [uploadedImageUrl],
  response_json_schema: {
    type: "object",
    properties: {
      plate_number: { type: "string" },
      region: { type: "string" }
    }
  }
});
Progress Tracking
// Update user progress
await User.updateMyUserData({
  completed_lessons: [...previousLessons, newLessonId],
  total_points: currentPoints + 50,
  badges_earned: [...badges, newBadgeId]
});
🎨 Design System
Color Palette
Primary: Cyan to Blue gradient (from-cyan-500 to-blue-600)
Secondary: Purple to Pink (from-purple-500 to-pink-600)
Background: Slate gradient (from-slate-50 via-blue-50 to-indigo-50)
Text: Slate scale (text-slate-800, text-slate-600)
Typography
Headings: Inter font family, gradient text effects
Body: Clean, readable spacing with Tailwind typography
Code: Monospace with syntax highlighting
📊 Admin Dashboard
Access comprehensive platform analytics:

User Management: View all registered students
Revenue Tracking: Monitor subscription metrics
Content Analytics: Track module completion rates
Engagement Metrics: Monitor AI mentor usage
Admin access is restricted to designated administrators only.

🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

Development Workflow
Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🔗 Links
Website: invictalabs-asit.com
Documentation: docs.invictalabs-asit.com
Support: support@invictalabs.com
Discord: Join our community
🎖️ Acknowledgments
Built on the powerful Base44 platform
AI capabilities powered by OpenAI and custom models
UI components from Shadcn/ui
Icons by Lucide
Made with ❤️ by the Invicta Labs team

⭐ Star us on GitHub | 📧 Get in touch
