const mongoose = require('mongoose');

// MongoDB Connection (cache the connection)
let cachedDb = null;

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  
  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    cachedDb = connection;
    console.log('✅ Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    const { method, url } = req;
    const urlParts = url.split('/').filter(Boolean);
    
    // GET /api/tasks
    if (method === 'GET' && urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'tasks') {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.status(200).json(tasks);
    }
    
    // GET /api/tasks/:id
    if (method === 'GET' && urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'tasks') {
      const task = await Task.findById(urlParts[2]);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      return res.status(200).json(task);
    }
    
    // POST /api/tasks
    if (method === 'POST' && urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'tasks') {
      const task = new Task({
        title: req.body.title,
        description: req.body.description
      });
      const newTask = await task.save();
      return res.status(201).json(newTask);
    }
    
    // PUT /api/tasks/:id
    if (method === 'PUT' && urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'tasks') {
      const task = await Task.findById(urlParts[2]);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      if (req.body.title !== undefined) task.title = req.body.title;
      if (req.body.description !== undefined) task.description = req.body.description;
      if (req.body.completed !== undefined) task.completed = req.body.completed;

      const updatedTask = await task.save();
      return res.status(200).json(updatedTask);
    }
    
    // DELETE /api/tasks/:id
    if (method === 'DELETE' && urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'tasks') {
      const task = await Task.findById(urlParts[2]);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      
      await task.deleteOne();
      return res.status(200).json({ message: 'Task deleted successfully' });
    }

    return res.status(404).json({ message: 'Route not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: error.toString() 
    });
  }
};
