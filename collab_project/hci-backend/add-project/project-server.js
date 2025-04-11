// Required packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hci-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define Project Schema
const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    trim: true
  },
  facultySupervisor: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  numberOfStudents: {
    type: Number,
    required: true,
    min: 1
  },
  studentNames: {
    type: [String],
    required: true,
    validate: [
      {
        validator: function(array) {
          return array.length === this.numberOfStudents;
        },
        message: 'Number of student names must match the specified number of students'
      },
      {
        validator: function(array) {
          return array.every(name => name.trim().length > 0);
        },
        message: 'Student names cannot be empty'
      }
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Project model
const Project = mongoose.model('projects', projectSchema);

// Add new project route
app.post('/api/projects', async (req, res) => {
  try {
    const {
      projectName,
      domain,
      facultySupervisor,
      startDate,
      numberOfStudents,
      studentNames
    } = req.body;

    // Create new project
    const project = new Project({
      projectName,
      domain,
      facultySupervisor,
      startDate,
      numberOfStudents,
      studentNames
    });

    // Save project to database
    await project.save();

    res.status(201).json({ 
      message: 'Project added successfully',
      project: project
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ 
      message: 'Server error during project creation',
      error: error.message
    });
  }
});

// Get all projects route
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
});

// Get single project route
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error while fetching project' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));