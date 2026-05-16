# Professional Realtime Chat App

Fullstack realtime 1-1 chat app using React, React Router, Axios, Zustand, TailwindCSS, Node.js, Express, Socket.IO, MongoDB, Mongoose, JWT and bcrypt.

## Reference Analysis

The referenced repository `mtikcode/Moji_RealtimeChatApp` is split into `backend` and `frontend`. Backend contains a package, `.env.example` and `src`. Frontend is a Vite React TypeScript app with `components`, `hooks`, `lib`, `pages`, `services`, `stores` and `types`. This implementation keeps that separation but uses a clearer backend layering: `config`, `models`, `controllers`, `routes`, `middleware`, `socket` and `utils`.

Source checked: https://github.com/mtikcode/Moji_RealtimeChatApp

## Architecture

- Frontend calls REST endpoints with Axios for auth, user lists and chat history.
- Frontend connects to Socket.IO with the JWT in `handshake.auth`.
- Backend protects REST routes and Socket.IO connections with JWT.
- MongoDB stores users and messages.
- Socket.IO rooms use each user's id, so direct messages are delivered to sender and receiver.

## Folder Structure

```txt
backend/
  src/
    config/db.js
    controllers/
    middleware/
    models/
    routes/
    socket/
    utils/
    server.js
frontend/
  src/
    components/
    layouts/
    pages/
    services/
    stores/
    styles/
```

## Database Schema

### User

- `name`: string, required
- `email`: string, unique, required
- `password`: hashed string, required, hidden by default
- `avatar`: string
- `lastSeen`: date
- timestamps

### Message

- `sender`: ObjectId -> User
- `receiver`: ObjectId -> User
- `text`: string
- `seenAt`: date
- timestamps

## API Endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `GET /api/users`
- `GET /api/messages/:userId`
- `POST /api/messages`

## Socket Events

- Client emits `message:send`, server emits `message:new`
- Server emits `users:online`
- Client emits `typing:start`, `typing:stop`
- Server emits `typing:start`, `typing:stop`
- Client emits `message:seen`, server emits `message:seen`

## Roadmap

1. Create backend structure and install Express, Socket.IO, Mongoose, JWT, bcrypt, dotenv and cors.
2. Add MongoDB connection and environment configuration.
3. Build User and Message schemas.
4. Build register, login, JWT middleware and protected `/me`.
5. Add users and messages REST APIs.
6. Add Socket.IO authentication and per-user rooms.
7. Build React Router auth flow and protected chat route.
8. Add Zustand stores for auth and chat state.
9. Add responsive chat layout with user list, online presence and message panel.
10. Verify local register/login/chat flow in two browser sessions.

## Local Setup

```bash
npm run install:all
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`
- MongoDB: `mongodb://127.0.0.1:27017/pro-chat-app`

## Advanced Features To Add Next

- Typing indicator with debounce and timeout cleanup.
- Seen messages emitted when a message becomes visible.
- Avatar upload using Cloudinary or S3.
- Group chat with a Conversation model.
- User search with server-side pagination.
- Browser notifications for background tabs.
- Render backend deploy, Vercel frontend deploy and MongoDB Atlas database.

## Completion Checklist

- [x] Backend folder structure
- [x] Frontend folder structure
- [x] JWT auth
- [x] Register and login
- [x] Protected routes
- [x] User list
- [x] Online/offline presence
- [x] Realtime direct messages
- [x] Message persistence
- [x] Chat history
- [x] Error and loading states
- [x] Responsive UI
- [x] Personal profile update
- [ ] Install dependencies locally
- [ ] Configure `.env`
- [ ] Run two browser sessions and test chat flow
