# Taskly - Task Management Application

## Project Structure
```
├── client/     # React frontend
├── server/     # Node.js/Express backend
```

## Setup Instructions

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup  
```bash
cd client
npm install
npm run dev
```

## API Endpoints
- `GET /api/v1/users` - Get all users
- `POST /api/v1/users/create` - Create user
- `PATCH /api/v1/users/update/:id` - Update user
- `DELETE /api/v1/users/delete/:id` - Delete user

## Environment Variables
Create `.env` file in server directory:
```
MONGODB_URI=your_mongodb_connection_string
MONGODB_DATABASE=your_database_name
PORT=3000
```
