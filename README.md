# 📋 Taskzy - Personal Task Management Application

A modern, full-stack task management application built with React, Node.js, Express, and MongoDB. Taskzy helps users organize their tasks with an intuitive interface, sorting capabilities, and secure user authentication.

![Taskzy Preview](https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Taskzy+Task+Management)

## ✨ Features

### 📝 Task Management
- ✅ **Create, Read, Update, Delete** tasks
- 🎯 **Priority levels** (High, Medium, Low)
- 📅 **Due date tracking**
- ✔️ **Status management** (Open/Done)
- 📄 **Detailed task descriptions**

### 🎨 User Experience
- 🔄 **Sortable columns** - Click headers to sort by name, priority, status, or due date
- 🔍 **Status filtering** - Filter tasks by completion status
- 📖 **Pagination** - Handle large task lists efficiently
- 📱 **Responsive design** - Works perfectly on all devices
- 💡 **Intuitive navigation** - Easy access to edit, view, and manage tasks

### 🔐 Security & Authentication
- 🔒 **Secure user authentication** (Login/Register)
- 👤 **User-specific tasks** - Each user sees only their own tasks
- 🛡️ **Protected routes** and API endpoints
- ✅ **Input validation** and error handling

### 🎯 Advanced Features
- 🏷️ **Visual priority badges** with color coding
- 🗂️ **Multiple view options** - List view with actions
- ⚡ **Real-time updates** without page refreshes
- 🎨 **Modern UI** with Chakra UI components

## 🏗️ Technology Stack

### Frontend
- ⚛️ **React 18** - Modern React with hooks
- 🎨 **Chakra UI** - Component library for beautiful UI
- 🔄 **React Router** - Client-side routing
- 📡 **Fetch API** - HTTP requests
- 🎯 **Context API** - State management

### Backend
- 🟢 **Node.js** - JavaScript runtime
- 🚀 **Express.js** - Web framework
- 🍃 **MongoDB** - NoSQL database
- 🔐 **bcryptjs** - Password hashing
- 🍪 **express-session** - Session management
- ⚡ **cors** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

### 1. Clone the Repository
```bash
git clone https://github.com/singhalaadi/taskly-capstone-project.git
cd taskly
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=taskzy
PORT=3000
SESSION_SECRET=your_super_secret_key_here
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### 3. Frontend Setup
```bash
cd client
npm install
```

Create `.env` file in client directory (optional):
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Start the frontend development server:
```bash
npm run dev
```
Client runs on `http://localhost:5173`

## 📚 API Documentation

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/users` | Get all users |
| `GET` | `/api/v1/users/:id` | Get user by ID |
| `POST` | `/api/v1/users/create` | Create new user |
| `PATCH` | `/api/v1/users/update/:id` | Update user |
| `DELETE` | `/api/v1/users/delete/:id` | Delete user |

### Task Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/tasks/user/:id` | Get all tasks for a user |
| `GET` | `/api/v1/tasks/:id` | Get single task |
| `POST` | `/api/v1/tasks/create` | Create new task |
| `PUT` | `/api/v1/tasks/update/:id` | Update task |
| `DELETE` | `/api/v1/tasks/delete/:id` | Delete task |

## 📁 Project Structure

```
taskzy/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── _skeletons/    # Loading skeletons
│   │   └── App.jsx        # Main App component
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── libs/             # Database connection
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── models/           # Data models (if using ODM)
│   ├── package.json
│   └── server.js         # Main server file
└── README.md
```

## 🎯 Usage Examples

### Creating a New Task
1. Click **"Create New Task"** button
2. Fill in task details (title, description, priority, due date)
3. Click **"Create Task"** to save

### Managing Tasks
- **Sort**: Click any column header to sort tasks
- **Filter**: Use the dropdown to filter by status (Open/Done)
- **Edit**: Click "Edit" button or visit task detail page
- **Complete**: Toggle task status from the detail page

### Navigation
- **Tasks List**: View all your tasks with sorting and filtering
- **Task Details**: Click on task title to view full details
- **Profile**: Manage your account settings

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
# Database
MONGODB_URI=your_mongodb_connection_string
MONGODB_DATABASE=your_database_name

# Server
PORT=3000
NODE_ENV=development

# Security
SESSION_SECRET=your_super_secret_session_key
```

#### Client (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas is configured for production
3. Update CORS settings for your frontend domain

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **AADITYA SINGHAL** - [GitHub Profile](https://github.com/singhalaadi)

## 🙏 Acknowledgments

- Thanks to the React and Node.js communities
- Chakra UI for the beautiful component library
- MongoDB for the flexible database solution

## 📊 Project Stats

- ⭐ **Stars**: If you like this project, please give it a star!
- 🐛 **Issues**: Found a bug? Report it in the issues section
- 🔧 **Pull Requests**: Contributions are welcome!

---

**Happy Task Managing! 📋✨**
