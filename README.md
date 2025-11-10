# 🎯 AI Career Coach - Your Intelligent Career Companion

<div align="center">

![AI Career Coach Banner](https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=AI+Career+Coach+🚀) <!-- Replace with your actual banner -->

[![Next.js](https://img.shields.io/badge/Next.js-15.0-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-FF6B35?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-10B981?style=for-the-badge&logo=vercel)](https://your-app.vercel.app)
[![GitHub Issues](https://img.shields.io/github/issues/Ayush-Raghuwanshi-Dev/ai-career-coach?style=for-the-badge&color=blue)](https://github.com/Ayush-Raghuwanshi-Dev/ai-career-coach/issues)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Transform your career journey with AI-powered guidance, resume analysis, and personalized learning roadmaps**

</div>

## ✨ Why Choose AI Career Coach?

<div align="center">

| 🚀 Smart Career Guidance | 📊 Resume Optimization | 🗺️ Personalized Roadmaps |
|:-------------------------:|:----------------------:|:------------------------:|
| Get AI-powered career advice tailored to your goals | Analyze and improve your resume with detailed insights | Create custom learning paths for any career field |

</div>

## 🎯 Featured Capabilities

### 🤖 Intelligent Career Assistant
<p align="center">
  <img src="https://via.placeholder.com/600x300/1E40AF/FFFFFF?text=AI+Career+Chat" width="45%" alt="AI Career Chat">
  <img src="https://via.placeholder.com/600x300/7C3AED/FFFFFF?text=Personalized+Guidance" width="45%" alt="Personalized Guidance">
</p>

- **💬 Real-time Career Q&A** - Get instant answers to career-related questions
- **🎯 Personalized Recommendations** - Tailored advice based on your background
- **📈 Progress Tracking** - Monitor your career development journey
- **🏆 Industry Insights** - Stay updated with latest career trends

### 📄 Advanced Resume Analyzer
<p align="center">
  <img src="https://via.placeholder.com/600x300/059669/FFFFFF?text=Resume+Scoring" width="45%" alt="Resume Scoring">
  <img src="https://via.placeholder.com/600x300/DC2626/FFFFFF?text=Detailed+Feedback" width="45%" alt="Detailed Feedback">
</p>

- **🔍 Comprehensive Analysis** - Deep dive into your resume's strengths and weaknesses
- **📊 Section-wise Scoring** - Contact info, experience, education, and skills evaluation
- **💡 Actionable Insights** - Specific suggestions for improvement
- **🎯 ATS Optimization** - Tips to beat Applicant Tracking Systems

### 🗺️ Interactive Roadmap Generator
<p align="center">
  <img src="https://via.placeholder.com/600x300/EA580C/FFFFFF?text=Learning+Path" width="45%" alt="Learning Path">
  <img src="https://via.placeholder.com/600x300/7C3AED/FFFFFF?text=Skill+Development" width="45%" alt="Skill Development">
</p>

- **🎯 Custom Learning Paths** - Generate roadmaps for any career or skill
- **📚 Resource Integration** - Curated learning materials and courses
- **⏱️ Time Estimation** - Realistic timelines for skill acquisition
- **🔄 Progress Visualization** - Track your learning journey visually

## 🛠️ Technology Stack

<div align="center">

| Category | Technologies |
|----------|--------------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?logo=tailwind-css) |
| **Backend** | ![Next.js API](https://img.shields.io/badge/Next.js_API-Routes-black?logo=next.js) ![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql) |
| **AI/ML** | ![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Model-4285F4?logo=google) |
| **Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?logo=vercel) |
| **UI/UX** | ![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-000000) ![Lucide](https://img.shields.io/badge/Lucide-Icons-FF6B35) |

</div>

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Google Gemini API** key
- **Clerk** account for authentication

### Installation Steps

<div align="center">

```bash
# 1. Clone the repository
git clone https://github.com/Ayush-Raghuwanshi-Dev/ai-career-coach.git

# 2. Navigate to project directory
cd ai-career-coach

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env.local

# 5. Run development server
npm run dev
</div>

Environment Setup
Create .env.local with the following variables:
# 🔐 Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# 🤖 AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# 🗄️ Database
DATABASE_URL=your_postgresql_connection_string

# 📁 File Storage
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_ENDPOINT_URL=your_imagekit_endpoint

📁 Project Architecture
ai-career-coach/
├── 🗂️ app/                    # Next.js 15 App Router
│   ├── (routes)/           # Route groups for organization
│   │   ├── dashboard/      # Main dashboard pages
│   │   └── ai-tools/       # AI tools section
│   ├── api/               # API routes
│   │   ├── ai-resume-agent/
│   │   ├── ai-roadmap-agent/
│   │   └── history/
│   └── globals.css        # Global styles
├── 🧩 components/         # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   └── dashboard/        # Dashboard specific components
├── ⚙️ configs/           # Configuration files
│   ├── db.ts            # Database configuration
│   └── schema.ts        # Database schemas
├── 🔄 inngest/          # Background job processing
├── 📦 public/           # Static assets
└── 🛠️ types/            # TypeScript type definitions

🎖️ Contribution Areas
🎨 UI/UX improvements

🚀 Performance optimizations

📚 Documentation updates

🧪 Test coverage

🔧 New AI features
📊 Project Stats
<div align="center">
https://img.shields.io/github/stars/Ayush-Raghuwanshi-Dev/ai-career-coach?style=for-the-badge&color=gold
https://img.shields.io/github/forks/Ayush-Raghuwanshi-Dev/ai-career-coach?style=for-the-badge&color=blue
https://img.shields.io/github/issues/Ayush-Raghuwanshi-Dev/ai-career-coach?style=for-the-badge
https://img.shields.io/github/issues-pr/Ayush-Raghuwanshi-Dev/ai-career-coach?style=for-the-badge

</div>
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

<div align="center">
⭐ Support the Project
If you find this project helpful, please consider giving it a star on GitHub!

https://api.star-history.com/svg?repos=Ayush-Raghuwanshi-Dev/ai-career-coach&type=Date

Built with ❤️ by Ayush Raghuwanshi

🚀 Ready to Transform Your Career?
Get Started · View Demo · Report Issue

</div> ```