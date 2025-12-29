# Task Manager Application

A full-stack task manager application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Task descriptions with timestamps
- ✅ Real-time statistics (total, pending, completed)
- ✅ Responsive design
- ✅ Clean and modern UI

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/rizwan/Desktop/test
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure MongoDB:**
   - Make sure MongoDB is running on your system
   - The default connection string is `mongodb://localhost:27017/taskmanager`
   - If you need to change it, edit the `.env` file

## Running the Application

1. **Start MongoDB** (if not already running):
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community

   # Or run directly
   mongod
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get a single task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Project Structure

```
task-manager/
├── models/
│   └── Task.js          # Mongoose schema for tasks
├── public/
│   ├── index.html       # Frontend HTML
│   ├── styles.css       # Frontend styles
│   └── app.js           # Frontend JavaScript
├── .env.example         # Example environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
├── server.js           # Express server and API routes
└── README.md           # This file
```

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose

- **Frontend:**
  - HTML5
  - CSS3
  - Vanilla JavaScript

## Usage

1. **Add a Task:** Enter a title and optional description, then click "Add Task"
2. **Complete a Task:** Check the checkbox next to a task
3. **Edit a Task:** Click the "Edit" button, modify the details, and click "Update Task"
4. **Delete a Task:** Click the "Delete" button and confirm

## Troubleshooting

- **MongoDB connection error:** Make sure MongoDB is running and the connection string in `.env` is correct
- **Port already in use:** Change the `PORT` in `.env` file
- **Dependencies error:** Delete `node_modules` folder and run `npm install` again

## License

ISC
