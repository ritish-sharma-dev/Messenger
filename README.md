# Full-Stack-Chat-App

A real-time chat application built with React, Node.js, Express, MongoDB, and Socket.IO. Full-Stack-Chat-App supports secure authentication, live online/offline presence, instant one-to-one messaging, image sharing, and profile management across a modern web UI.

Live demo: _add your deployed Vercel frontend URL here_  
Backend API: _add your deployed Render URL here_

![Full-Stack-Chat-App preview](./docs/preview.gif)

> If you do not have a GIF yet, replace the image above with a screenshot or screen recording from the running app.

## Core Features

- **Real-Time Messaging:** Instant message delivery between users with Socket.IO-powered live updates.
- **Live Presence Tracking:** See who is online and update presence automatically when users connect or disconnect.
- **Authentication:** Secure signup, login, logout, and session restoration using HTTP-only JWT cookies.
- **User Profiles:** Update full name, bio, and profile picture.
- **Unread Message Counts:** Track unseen messages per user and clear them when a conversation is opened.
- **Media Sharing:** Send image messages with Cloudinary-backed uploads.
- **Responsive UI:** Clean chat layout with sidebar navigation, active conversation view, and profile panel.

## Tech Stack & Architecture

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hot Toast
- Socket.IO Client

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- Cloudinary for media uploads
- Nodemailer available in the server dependencies

### Real-Time Engine
- Socket.IO for bi-directional events
- Online users are tracked in memory with a `userSocketMap`
- Message events are emitted directly to the receiving user's socket when available

### Data Layer
- MongoDB stores users and messages
- Messages contain sender, receiver, text, image URL, seen state, and timestamps
- HTTP-only cookies are used for session persistence across refreshes

## How It Works

1. The client checks the authenticated session on load with `/api/auth/check`.
2. If the user is authenticated, the app connects a Socket.IO client using the user id.
3. When a message is sent, the backend saves it in MongoDB and emits it to the receiver's active socket if they are online.
4. Presence is updated by the server whenever sockets connect or disconnect.
5. Unseen message counts are updated on the client when messages arrive while a chat is closed.

## Reconnection & Offline Handling

- Socket.IO automatically retries transport-level reconnection when the connection drops.
- On page refresh, the client re-checks authentication and reconnects the socket after the user session is restored.
- If a message arrives while a conversation is not open, the client stores an unseen count for that sender.
- For production deployments, make sure the frontend and backend URLs are set correctly so the auth cookie and socket connection can survive cross-origin requests.

## Database Schema Snapshot

### `User`

```js
{
  email: String,
  fullName: String,
  password: String,
  profilePic: String,
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### `Message`

| Field | Type | Notes |
| --- | --- | --- |
| `senderId` | ObjectId | Reference to `User` |
| `receiverId` | ObjectId | Reference to `User` |
| `text` | String | Optional text content |
| `image` | String | Optional Cloudinary image URL |
| `seen` | Boolean | Defaults to `false` |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Full-Stack-Chat-App
```

### 2. Install dependencies

This project uses separate client and server folders, so install dependencies in both:

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Run the development servers

Open two terminals:

```bash
# Terminal 1
cd client
npm run dev
```

```bash
# Terminal 2
cd server
npm run dev
```

The client runs on Vite's default port and the server runs on port `5000` unless you change it in `.env`.

## Environment Variables

### Client `.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

### Server `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Deployment Notes

- Set `CLIENT_URL` on the backend to your deployed Vercel frontend URL.
- Set `VITE_BACKEND_URL` on the frontend to your deployed Render backend URL.
- Keep `withCredentials: true` enabled in the client so cookies are sent with requests.
- If you deploy behind HTTPS, make sure the backend is configured to allow cross-origin cookies.

## Project Structure

```bash
Full-Stack-Chat-App/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── lib/
│       └── pages/
└── server/
    └── src/
        ├── controllers/
        ├── lib/
        ├── middleware/
        ├── models/
        └── routes/
```

## Screenshots

_Add a high-quality screenshot or GIF here to showcase the UI in action._

## Future Improvements

- Typing indicators
- Read receipts
- Group chats or channels
- Message search
- Message reactions
- Local offline message queue

## License

Add your preferred license here before publishing publicly.
