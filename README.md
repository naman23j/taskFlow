# TaskFlow

TaskFlow is a lightweight Trello-style task and project management app built with the MERN stack. It includes JWT authentication, board/task CRUD, server-side ownership checks, and a backend-only AI estimate endpoint so task planning stays secure and centralized.

## Screenshots

Add screenshots for the following views before submission:
- Login page
- Dashboard board list
- Board view with task columns
- Mobile responsive view

## Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Styled Components
- Context API
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT via jsonwebtoken
- bcryptjs
- CORS, Helmet, dotenv

### AI
- Google Gemini free tier via backend-only API calls

## Setup Instructions

### 1. Clone and install
```bash
npm install
npm install --workspace backend
npm install --workspace frontend
```

### 2. Configure environment files
- Copy backend `.env.example` to `backend/.env`
- Copy frontend `.env.example` to `frontend/.env`
- Fill in your MongoDB connection string, JWT secret, and Gemini API key

### 3. Start the backend
```bash
npm run dev:backend
```

### 4. Start the frontend
```bash
npm run dev:frontend
```

### 5. Open the app
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Environment Variables

### Backend

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime mode such as `development` or `production` |
| `PORT` | Express server port |
| `DATABASE_URL` | MongoDB connection string |
| `MONGODB_URI` | Alternate MongoDB connection string fallback |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRE` | Token lifetime, default `7d` |
| `LLM_API_KEY` | Gemini or Groq API key used only on the backend |
| `LLM_API_PROVIDER` | AI provider name, default `gemini` |
| `LLM_MODEL` | Provider model name, default `gemini-2.0-flash` |
| `FRONTEND_URL` | Frontend origin for CORS |
| `CORS_ORIGIN` | Explicit CORS allowlist origin |

### Frontend

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base API URL, usually `http://localhost:5000/api` |

## LLM API Choice

This implementation uses Google Gemini because it has a practical free tier and supports structured backend requests. The API key never reaches the browser; the frontend only calls the local backend endpoint and the backend proxies the estimate request.

## API Documentation

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user and return a JWT |
| POST | `/api/auth/login` | Log in a user and return a JWT |
| GET | `/api/auth/me` | Return the authenticated user |
| POST | `/api/auth/logout` | Clear the session on the client side |
| GET | `/api/boards` | List boards owned by the current user |
| POST | `/api/boards` | Create a board |
| GET | `/api/boards/:boardId` | Get a board and its tasks |
| PATCH | `/api/boards/:boardId` | Update a board |
| DELETE | `/api/boards/:boardId` | Delete a board and its tasks |
| GET | `/api/boards/:boardId/tasks` | List tasks for a board with filters |
| POST | `/api/boards/:boardId/tasks` | Create a task inside a board |
| GET | `/api/boards/:boardId/tasks/:taskId` | Get a specific task |
| PATCH | `/api/boards/:boardId/tasks/:taskId` | Update a task |
| DELETE | `/api/boards/:boardId/tasks/:taskId` | Delete a task |
| POST | `/api/tasks/suggest-estimate` | Get an AI effort and due date suggestion |
| GET | `/api/health` | Health check endpoint |

## Live Demo URLs

- Frontend URL: not deployed yet
- Backend API URL: not deployed yet

## Test Credentials

No demo credentials are seeded by default. Register a new account locally to test the app.

## Known Issues / Limitations

- The app currently uses client-side filtering and sorting for the board view after the board payload is loaded.
- Drag-and-drop is not implemented; task moves are handled through status buttons.
- AI estimates depend on a valid Gemini or Groq API key.
- Automated tests and deployment pipelines are not included yet.

## Future Improvements

- Add dnd-kit drag-and-drop support
- Add Jest, Supertest, and React Testing Library coverage
- Add analytics charts for board and task activity
- Add subtasks and shared board permissions
- Add pagination and full-text search

## Installation and Local Usage

1. Install dependencies from the repository root.
2. Create backend and frontend `.env` files from the provided examples.
3. Start MongoDB Atlas or another hosted MongoDB instance.
4. Start the backend on port `5000`.
5. Start the frontend on port `5173`.
6. Register a user, create a board, then add tasks to that board.
7. Use the AI suggestion button in the task modal if your backend AI key is configured.

## Project Structure

- `backend/` contains the Express API, models, controllers, routes, middleware, and AI helper.
- `frontend/` contains the React app, route pages, contexts, services, and shared UI.

## Notes for Submission

- Add screenshots before final delivery.
- Replace the live demo placeholders with your deployed URLs.
- Keep all secrets in `.env` files and out of version control.
