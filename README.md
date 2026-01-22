# SkillForge AI 🚀

A premium SaaS platform for course hosting powered by Google Gemini AI. Create comprehensive courses with AI-generated curricula and provide students with an intelligent AI tutor.

## 🎯 Features

### Phase 1: Core & Schema Agent (MVP) ✅
- **Authentication System**: Secure JWT-based authentication with bcrypt password hashing
- **User Roles**: Support for Creators, Students, and Admins
- **AI Curriculum Architect**: Generate complete course structures from a simple topic using Google Gemini
- **Course Management**: Create, save, and manage courses with modules and lessons
- **Premium UI**: Modern, responsive design with Tailwind CSS (Blue/Teal theme)

### Phase 2: Tutor Agent & RAG ✅
- **AI Tutor**: Intelligent chatbot that answers student questions based on course content
- **Context-Aware Responses**: RAG-style retrieval of relevant course material
- **Interactive Chat Interface**: Real-time chat widget integrated into course view
- **Student Course View**: Clean, organized interface for course consumption

### Phase 3: Optimization & Public API (Coming Soon)
- Background worker to analyze tutor interactions
- Action recommendations for course creators
- Public REST API for third-party integrations

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **AI**: Google Gemini API (@google/generative-ai)

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📦 Project Structure

```
sonic-bohr/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable components (ChatInterface)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CourseCreator.tsx
│   │   │   └── CourseView.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   └── package.json
└── server/                 # Backend application
    ├── src/
    │   ├── config/         # Configuration (db.ts)
    │   ├── controllers/    # Route controllers
    │   ├── middleware/     # Express middleware (auth)
    │   ├── routes/         # API routes
    │   ├── services/       # Business logic (AI services)
    │   └── index.ts
    ├── prisma/
    │   └── schema.prisma   # Database schema
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Google Gemini API Key

### Environment Setup

1. **Clone the repository** (if applicable)

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Create `.env` file in `server/` directory**:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/skillforge_ai?schema=public"
   JWT_SECRET="your_super_secret_jwt_key_here"
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Setup Database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations (create tables)
   npx prisma migrate dev --name init
   ```

5. **Build Backend**
   ```bash
   npm run build
   ```

6. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

7. **Build Frontend**
   ```bash
   npm run build
   ```

### Running the Application

#### Development Mode

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173` (or similar)
The backend API runs on `http://localhost:3000`

#### Production Mode

**Backend**:
```bash
cd server
npm run build
npm start
```

**Frontend**:
```bash
cd client
npm run build
npm run preview
```

## 🎨 Design System

### Color Palette
- **Primary (Blue)**: `#1e40af` (blue-800) - Trust, professionalism
- **Secondary (Teal)**: `#2dd4bf` (teal-400) - AI features, success states
- **Background**: `#f9fafb` (gray-50)
- **Typography**: Inter font family

### Key Design Principles
- Clean, modern SaaS aesthetic
- High contrast for readability
- Premium feel with subtle animations
- Mobile-responsive layouts

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and receive JWT token

### Courses
- `POST /api/courses/generate` - Generate course structure with AI (requires auth)
- `POST /api/courses/save` - Save generated course to database (requires auth)
- `POST /api/courses/:courseId/chat` - Chat with AI tutor (requires auth)

## 🔐 Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Prepared statements (Prisma) to prevent SQL injection
- CORS and Helmet middleware
- Protected routes with authentication middleware

## 🤖 AI Integration

### Curriculum Architect
Uses Google Gemini to generate comprehensive course structures:
- Input: Course topic (e.g., "Introduction to Python")
- Output: Complete JSON structure with modules and lessons

### AI Tutor
Context-aware chatbot that:
- Retrieves relevant course content
- Answers questions based only on course material
- Provides encouraging, helpful responses
- Implemented with retrieval-augmented generation (RAG) pattern

## 📝 Database Schema

```prisma
User (id, email, password, name, role, timestamps)
  └── Course (creator relationship)
  └── Enrollment (student relationship)

Course (id, title, description, published, creatorId, timestamps)
  └── Module (many)
  └── Enrollment (many)

Module (id, title, order, courseId)
  └── Lesson (many)

Lesson (id, title, content, order, moduleId)

Enrollment (id, userId, courseId, enrolledAt)
```

## 🛠️ Development Commands

### Backend
```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled production code
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Database
```bash
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Create and apply migrations
npx prisma studio          # Open Prisma Studio (database GUI)
```

## 🎓 Usage Guide

### For Creators
1. Register as a CREATOR
2. Login to access dashboard
3. Click "Create New Course"
4. Enter your course topic
5. Review AI-generated structure
6. Save course to database

### For Students
1. Register as a STUDENT
2. Enroll in courses (via database or future enrollment API)
3. View course content
4. Ask questions to the AI Tutor
5. Learn at your own pace

## 🚧 Future Enhancements (Phase 3+)

- **Optimization Agent**: Analyze student questions to suggest course improvements
- **Public API**: REST endpoints for external integrations
- **Vector Database**: Implement true semantic search for better RAG
- **Course Publishing**: Marketplace for course discovery
- **Progress Tracking**: Student completion analytics
- **Quizzes**: AI-generated assessments
- **Video Support**: Multimedia content integration
- **Real-time Collaboration**: Live sessions and discussions

## 📄 License

This project is part of the SkillForge AI platform.

## 🙏 Acknowledgments

- Built with Google Gemini AI
- Powered by React, Express, and PostgreSQL
- Designed with Tailwind CSS
- Icons by Lucide

---

**Built with ❤️ using cutting-edge AI technology**
