# ChatGPT Clone Monorepo

This project is a lightweight ChatGPT clone with:

-   **Frontend:** Next.js (React) in `apps/web`
-   **Backend:** NestJS (TypeScript) in `apps/api`

## Features

-   Basic chat UI (text, image, file upload)
-   OpenAI API integration (chat, vision, embeddings, fine-tuning)
-   Simple RAG pipeline (in-memory vector store)
-   No authentication or database (all state is in memory or browser)

## Getting Started

### Frontend (Next.js)

```sh
cd apps/web
npm run dev
```

### Backend (NestJS)

```sh
cd apps/api
npm run start:dev
```

## Environment Variables

-   Configure your OpenAI API key in the backend using environment variables.

## Project Structure

-   `apps/web`: Next.js frontend
-   `apps/api`: NestJS backend

---

For more details, see the code in each app directory.
