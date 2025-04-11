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

// Define Project Schema (from previous code)
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
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define Active Project Schema (for student-faculty-project mapping)
const activeProjectSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  facultyName: {
    type: String,
    required: true,
    trim: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projects',
    required: true
  },
  domain: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const Project = mongoose.model('projects', projectSchema);
const ActiveProject = mongoose.model('active_projs', activeProjectSchema);

// Middleware to process new projects and update active_projs
const updateActiveProjects = async (req, res, next) => {
  // Get the newly created project
  const projectId = req.projectId;
  
  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      return next();
    }
    
    // Delete any existing mappings for this project to avoid duplicates
    await ActiveProject.deleteMany({ projectId: project._id });
    
    // Create a new active project entry for each student
    const activeProjectPromises = project.studentNames.map(studentName => {
      return new ActiveProject({
        studentName,
        facultyName: project.facultySupervisor,
        projectName: project.projectName,
        projectId: project._id,
        domain: project.domain,
        startDate: project.startDate
      }).save();
    });
    
    await Promise.all(activeProjectPromises);
    
    next();
  } catch (error) {
    console.error('Error updating active projects:', error);
    next();
  }
};

// Add new project route (reused from previous code)
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
    const savedProject = await project.save();
    
    // Add the project ID to the request object
    req.projectId = savedProject._id;
    
    // Use the middleware to update active_projs
    await updateActiveProjects(req, res, () => {});

    res.status(201).json({ 
      message: 'Project added successfully',
      project: savedProject
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ 
      message: 'Server error during project creation',
      error: error.message
    });
  }
});

// Get all active projects with student-faculty mappings
app.get('/api/active-projects', async (req, res) => {
  try {
    const activeProjects = await ActiveProject.find().sort({ facultyName: 1, projectName: 1, studentName: 1 });
    res.status(200).json(activeProjects);
  } catch (error) {
    console.error('Error fetching active projects:', error);
    res.status(500).json({ message: 'Server error while fetching active projects' });
  }
});

// Get active projects filtered by faculty
app.get('/api/active-projects/faculty/:facultyName', async (req, res) => {
  try {
    const activeProjects = await ActiveProject.find({ 
      facultyName: req.params.facultyName 
    }).sort({ projectName: 1, studentName: 1 });
    
    res.status(200).json(activeProjects);
  } catch (error) {
    console.error('Error fetching faculty projects:', error);
    res.status(500).json({ message: 'Server error while fetching faculty projects' });
  }
});

// Get active projects filtered by student
app.get('/api/active-projects/student/:studentName', async (req, res) => {
  try {
    const activeProjects = await ActiveProject.find({ 
      studentName: req.params.studentName 
    }).sort({ facultyName: 1, projectName: 1 });
    
    res.status(200).json(activeProjects);
  } catch (error) {
    console.error('Error fetching student projects:', error);
    res.status(500).json({ message: 'Server error while fetching student projects' });
  }
});

// Print all active projects to console (for demonstration purposes)
app.get('/api/print-active-projects', async (req, res) => {
  try {
    const activeProjects = await ActiveProject.find().sort({ facultyName: 1, projectName: 1, studentName: 1 });
    
    console.log('\n======== ACTIVE PROJECTS ========');
    console.log(`Total mappings: ${activeProjects.length}`);
    
    // Group by faculty and project
    const groupedProjects = {};
    
    activeProjects.forEach(project => {
      const facultyName = project.facultyName;
      const projectName = project.projectName;
      
      if (!groupedProjects[facultyName]) {
        groupedProjects[facultyName] = {};
      }
      
      if (!groupedProjects[facultyName][projectName]) {
        groupedProjects[facultyName][projectName] = {
          domain: project.domain,
          startDate: project.startDate,
          students: []
        };
      }
      
      groupedProjects[facultyName][projectName].students.push(project.studentName);
    });
    
    // Print the grouped data
    Object.keys(groupedProjects).forEach(faculty => {
      console.log(`\nFaculty: ${faculty}`);
      
      Object.keys(groupedProjects[faculty]).forEach(project => {
        const projectData = groupedProjects[faculty][project];
        console.log(`  Project: ${project} (${projectData.domain}) - Started: ${projectData.startDate.toDateString()}`);
        console.log(`  Students: ${projectData.students.join(', ')}`);
        console.log('  ' + '-'.repeat(50));
      });
    });
    
    console.log('\n======== END OF REPORT ========\n');
    
    res.status(200).json({ 
      message: 'Active projects printed to console', 
      count: activeProjects.length 
    });
  } catch (error) {
    console.error('Error printing active projects:', error);
    res.status(500).json({ message: 'Server error while printing active projects' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));