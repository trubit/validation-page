# TRUSON — Secure Login & Signup Platform

A modern, high-performance, and responsive authentication application built with **React 19**, **TypeScript**, and **Vite**.

---

## 🚀 Features

- **Auth Workflows**: Toggle seamlessly between Login and Signup modes.
- **Form Validation**: Real-time client-side validation for email, password strength, match confirmation, and full name.
- **Password Security**: Show/hide toggle and password strength meter.
- **Forgot Password Modal**: Interactive recovery modal with validation.
- **Social OAuth Integration**: Mock Google OAuth integration with customizable client ID.
- **Resilient API Architecture**: Integrated exponential backoff retry mechanism (`retry.ts`) and structured toast notification system.
- **Responsive & Accessible Design**: Crafted with modern dark mode aesthetic, smooth CSS gradients, glassmorphism, and dynamic layout bounds.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript 6
- **Styling**: Vanilla CSS (CSS Design System with tokens & responsive utility classes)
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
VITE_API_BASE_URL=https://api.truson.example.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> **Note**: Never commit `.env` or any production secrets to source control.

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Tests
```bash
npm run test
```

### 4. Type Check & Build for Production
```bash
# Type-check TypeScript code
npx tsc --noEmit

# Production build (outputs to dist/)
npm run build
```

---

## 🌐 Production Deployment (Vercel)

### Recommended Vercel Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables on Vercel

In the Vercel Dashboard under **Project Settings → Environment Variables**, configure:
- `VITE_API_BASE_URL`
- `VITE_GOOGLE_CLIENT_ID`

Assign these to **Production**, **Preview**, and **Development** environments as required.

