# GigFlow - Freelance Marketplace Platform

A full-stack mini-freelance marketplace where Clients can post jobs (Gigs) and Freelancers can apply for them (Bids). Built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

### Core Features
- ✅ **User Authentication**: Secure sign-up and login with JWT tokens stored in HttpOnly cookies
- ✅ **Gig Management**: Browse, search, and create job postings
- ✅ **Bidding System**: Freelancers can submit bids on open gigs
- ✅ **Hiring Logic**: Clients can hire freelancers with atomic transaction handling
- ✅ **Real-time Notifications**: Socket.io integration for instant updates when hired

### Bonus Features
- ✅ **Transactional Integrity**: MongoDB transactions prevent race conditions when hiring
- ✅ **Real-time Updates**: Socket.io notifications for instant hiring alerts

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Redux Toolkit
- React Router
- Socket.io Client
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io
- Bcryptjs

## Project Structure

```
GigFlow/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Gig.js
│   │   └── Bid.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── gigs.js
│   │   └── bids.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and set HttpOnly cookie
- `POST /api/auth/logout` - Logout and clear cookie
- `GET /api/auth/me` - Get current user

### Gigs
- `GET /api/gigs` - Fetch all open gigs (with optional `?search=query` parameter)
- `POST /api/gigs` - Create a new gig (requires authentication)
- `GET /api/gigs/:id` - Get a single gig by ID

### Bids
- `POST /api/bids` - Submit a bid for a gig (requires authentication)
- `GET /api/bids/:gigId` - Get all bids for a specific gig (owner only)
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (owner only, with transactional integrity)
- `GET /api/bids/user/my-bids` - Get current user's bids
- `GET /api/bids/user/my-gigs` - Get current user's posted gigs

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Gig
```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: String (enum: ['open', 'assigned']),
  timestamps: true
}
```

### Bid
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  price: Number,
  status: String (enum: ['pending', 'hired', 'rejected']),
  timestamps: true
}
```

## Key Features Explained

### 1. Hiring Logic with Transactional Integrity
The hiring process uses MongoDB transactions to ensure atomicity:
- When a client clicks "Hire", the system:
  1. Starts a transaction
  2. Checks if the gig is still open (atomic check)
  3. Updates the gig status to "assigned"
  4. Marks the chosen bid as "hired"
  5. Marks all other bids as "rejected"
  6. Commits the transaction

This prevents race conditions where multiple users might try to hire different freelancers simultaneously.

### 2. Real-time Notifications
When a freelancer is hired:
- The server emits a Socket.io event to the freelancer's user-specific room
- The frontend receives the notification instantly
- A notification banner appears without page refresh

## Usage

1. **Register/Login**: Create an account or login to access the platform
2. **Browse Gigs**: View all open gigs on the home page
3. **Search**: Use the search bar to find gigs by title
4. **Post a Gig**: Click "Post a Gig" to create a new job posting
5. **Submit Bids**: Click on a gig to view details and submit a bid
6. **Manage Bids**: Gig owners can view all bids and hire freelancers
7. **View Status**: Check "My Bids" to see the status of your submitted bids

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens stored in HttpOnly cookies (prevents XSS attacks)
- CORS configured for secure cross-origin requests
- Authentication middleware protects sensitive routes
- Input validation on all endpoints

## Development

### Backend
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend
```bash
cd frontend
npm run dev  # Vite dev server with hot reload
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
npm start
```

## Testing the Hiring Flow

1. Create two user accounts (Client and Freelancer)
2. Client posts a gig
3. Freelancer submits a bid
4. Client views bids on the gig details page
5. Client clicks "Hire This Freelancer"
6. Freelancer receives real-time notification
7. All other bids are automatically rejected
8. Gig status changes to "assigned"

## License

This project is created for educational purposes as part of a full-stack development internship assignment.

## Author

Created as part of the GigFlow Full Stack Development Internship Assignment.

