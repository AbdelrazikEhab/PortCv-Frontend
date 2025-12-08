# PortCV - Professional Portfolio & Resume Builder

Build stunning ATS-friendly resumes and showcase your work with a personalized portfolio website.

## Features

- **AI-Powered Resume Parser** - Upload your CV and let AI extract the data
- **Professional Portfolio** - Custom subdomain portfolios (username.portcv.com)
- **ATS Optimization** - Get your resume past applicant tracking systems
- **Real-time Preview** - See changes as you make them
- **Multiple Themes** - Choose from various color schemes and layouts
- **Project Showcase** - Display your work with images and links

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS
- Prisma + PostgreSQL
- Express.js Backend
- OpenAI API Integration

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run database migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```
5. Start development servers:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend && npm run dev
   ```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (backend/.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
OPENAI_API_KEY=your-openai-key
ADMIN_EMAIL=admin@example.com
```

## License

MIT
