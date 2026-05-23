#  ApnaNyaya (अपना न्याय)

### *Legal Intelligence for Every Indian*

[![Live Demo](https://img.shields.io/badge/Live-Demo-gold?style=for-the-badge&logo=vercel)](https://apna-nyaya.vercel.app/)
[![Tech](https://img.shields.io/badge/Stack-TanStack%20Start%20%7C%20Firebase%20%7C%20Groq-white?style=for-the-badge)](https://groq.com)

---

##  The Vision

1.4 billion people. 1.7 million lawyers. Most Indians are one legal problem away from bankruptcy or exploitation. **ApnaNyaya** bridges this gap by providing instant, multilingual, and actionable legal intelligence to every citizen.

Describe your problem in plain Hindi, English, or Hinglish. We tell you your rights, generate court-standard documents, and give you a step-by-step action plan — in under 3 minutes.

---

##  Key Features

### 1. Multilingual Voice Chat (LexAI)
A floating assistant that understands regional Indian languages. Hold to speak, release to send. 
- Powered by **Groq (Llama-3.3 70B)** for low-latency, nuanced legal reasoning.
- Supports Hindi, English, Hinglish, and several regional dialects.

###  2. Situation Analyzer & Strategy Engine
Toggle between high-level strategic analysis and specific statutory rights. 
- Classifies your case automatically (Labour Law, Consumer Protection, RTI, etc.).
- Identifies critical sections and relevant acts.

###  3. Smart Case & Deadline Tracker
Never miss a statute of limitation again.
- **Smart Presets**: Automatically populates deadlines based on case type (e.g., 30 days for an RTI response).
- **Pulse Notifications**: Real-time overdue alerts directly in your navigation bar.
- **Timeline Visualization**: A vertical timeline of your legal errands and milestones.

###  4. Document Automator & DIY Rights
Step-by-step guidance to generate legal notices, RTI applications, and complaints without paying thousands in legal fees.

---

##  Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/guide/start) (Full-stack React with Vite)
- **AI Engine**: [Groq Cloud](https://groq.com/) (Llama-3.3-70b-versatile)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore Real-time DB & Firebase Auth)
- **Styling**: Tailwind CSS with a custom **Lex-Aesthetic** (Premium gold accents, high-contrast typography)
- **Animations**: Framer Motion
- **Voice**: Web Speech API (webkitSpeechRecognition)

---

##  Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ApnaNyaya.git
   cd ApnaNyaya/LexAI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root:
   ```env
   # Groq API Key
   GROQ_API_KEY=your_groq_api_key

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

---

##  Design Philosophy

ApnaNyaya uses a **State-of-the-Art** design system inspired by premium legal firms:
- **HSL-tailored Palettes**: Deep charcoal backgrounds with burnished gold accents.
- **Micro-animations**: Subtle transitions that guide the user through complex legal information.
- **A11y First**: Optimized for screen readers and high readability for diverse user groups.

---

##  The Mission

ApnaNyaya aims to decentralize legal power and put the "Strategy of the Strong" into the hands of the everyman. By combining AI with authentic legal knowledge, we are making justice accessible, affordable, and actionable for a billion people.

---

##  Links

- **Live App**: [https://apna-nyaya.vercel.app/](https://apna-nyaya.vercel.app/)
- **Demo Video**: [Coming Soon]
- **Presentation Deck**: [Check Artifacts]

---

Developed with by **Team LexAI / ApnaNyaya**
