# 🌌 Star Wars Codex

[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=flat&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-red?style=flat&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Tests-Jest-C21325?style=flat&logo=jest)](https://jestjs.io/)
[![Arwes](https://img.shields.io/badge/UI-Arwes-4B0082?style=flat)](https://arwes.dev/)

**Star Wars Codex** is a futuristic, full-stack web application where users can explore a vast catalog of characters, movies, planets, and starships from the Star Wars universe.

This project was developed as a coding challenge for **Conexa**, showcasing full-stack TypeScript development with an animated sci-fi UI and a robust CI/CD pipeline.

## ✨ Tech Stack

- **Frontend**: [Next.js (App Router)](https://nextjs.org/) with [Arwes](https://arwes.dev/) for immersive, sci-fi-inspired visuals and animations.
- **Backend**: [NestJS](https://nestjs.com/) REST API with typed endpoints.
- **Shared Types**: TypeScript types shared across frontend and backend via a local workspace package.
- **CI/CD**: GitHub Actions for build, test, and Prettier check on all branches.
- **Deployment**:
    - Frontend: [Vercel](https://sw-facumidvetkin-frontend.vercel.app/)
    - Backend: [Railway](https://sw-facumidvetkin-production.up.railway.app/)

## 🚀 Getting Started

### 📦 Set Up
```bash
cp .example.env .env
npm install
```

### 🛠️ Start the App (Development)

#### Start both apps together:
```bash
npm run dev
```

#### Or individually:
```bash
# Frontend
npm run dev:frontend

# Backend
npm run dev:backend
```

### 🧪 Run Tests (Unit)
```bash
# Frontend
npm run test:frontend

# Backend
npm run test:backend
```

## 📦 Deployment

| Layer     | Platform | URL                                                                 |
|-----------|----------|----------------------------------------------------------------------|
| Frontend  | Vercel   | [sw-facumidvetkin-frontend.vercel.app](https://sw-facumidvetkin-frontend.vercel.app/) |
| Backend   | Railway  | [sw-facumidvetkin-production.up.railway.app](https://sw-facumidvetkin-production.up.railway.app/) |
