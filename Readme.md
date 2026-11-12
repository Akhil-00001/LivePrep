# LivePrep

LivePrep is an AI mock-interview platform. Upload your resume and an AI interviewer asks you technical, HR or behavioural questions out loud, times each answer, and gives feedback and a score on every one. It also includes aptitude tests and a behavioural question guide.

## Features

- **Resume-based questions**: upload a PDF resume and questions are tailored to your projects and skills.
- **One interview flow, three types**: technical, HR and behavioural rounds, chosen on the setup screen.
- **Spoken interviewer**: questions are read aloud by an interviewer video; answer by typing or with your microphone.
- **Focus mode**: navigation is hidden during a live interview, with a timer bar for each question.
- **Feedback and scoring**: per-answer feedback with a model answer, plus confidence, communication and correctness ratings.
- **Reports**: interview history, score charts and downloadable PDF reports.
- **Aptitude tests**: 20 timed multiple-choice questions per test, with fewer repeats between attempts.
- **Behavioural guide**: common questions and workplace scenarios with how to answer and sample answers.
- **Sign-in**: email and password, or Google via Firebase. Google sign-ins are verified on the server with Firebase ID tokens.
- **Credits**: credit packs paid through Razorpay.
- **Responsive layout**: collapsible sidebar on desktop, bottom navigation on mobile.

## Tech stack

**Frontend**: React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router, Motion, Recharts, jsPDF, Firebase Auth

**Backend**: Node.js, Express, MongoDB (Mongoose), JWT in httpOnly cookies, Multer, PDF.js, firebase-admin

**Services**: OpenRouter (question generation and evaluation), Razorpay (payments), Firebase Authentication (Google sign-in)

## Running locally

Requirements: Node.js 20+, a MongoDB database, and accounts for OpenRouter, Razorpay and Firebase.

```bash
# Backend
cd server
cp .env.example .env   # fill in the values
npm install
npm run dev

# Frontend (in a second terminal)
cd client
cp .env.example .env   # set VITE_API_URL=http://localhost:8000 and your Firebase key
npm install
npm run dev
```

The frontend runs on http://localhost:5173.

### Environment variables

| Where  | Variable | Purpose |
| ------ | -------- | ------- |
| server | `MONGODB_URL` | MongoDB connection string |
| server | `JWT_SECRET` | Secret for signing login tokens |
| server | `OPENROUTER_API_KEY` | AI question generation and feedback |
| server | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Payments |
| server | `FIREBASE_PROJECT_ID` | Verifying Google sign-in tokens |
| server | `CLIENT_URL` | Deployed frontend URL(s), comma-separated, allowed by CORS |
| server | `PORT`, `NODE_ENV` | Server port; `production` enables secure cookies |
| client | `VITE_API_URL` | Backend URL |
| client | `VITE_FIREBASE_APIKEY` | Firebase web API key |

Never commit `.env` files; they are ignored by git.

## How it works

1. You sign in and set up an interview: job title, experience, interview type and optionally a resume.
2. The backend extracts text from the resume with PDF.js and asks the AI for tailored questions.
3. The interviewer reads each question aloud; you answer within the time limit.
4. Each answer is sent to the AI, which returns feedback, a model answer and a score.
5. When the interview ends, a report is saved and can be viewed or downloaded as a PDF.
