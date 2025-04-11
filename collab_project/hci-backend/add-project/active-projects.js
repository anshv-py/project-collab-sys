document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projectsContainer');
    const facultyFilter = document.getElementById('facultyFilter');
    const searchInput = document.getElementById('searchInput');
    const printBtn = document.getElementById('printBtn');
    
    let allProjects = [];
    let faculties = new Set();
    
    // Function to fetch all active projects
    async function fetchActiveProjects() {
        try {
            const response = await fetch('http://localhost:5000/api/active-projects');
            if (!response.ok) {
                throw new Error('Failed to fetch active projects');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching active projects:', error);
            return [];
        }
    }
    
    // Function to group projects by faculty and project
    function groupProjectsByFaculty(projects) {
        const groupedData = {};
        
        projects.forEach(project => {
            const facultyName = project.facultyName;
            const projectName = project.projectName;
            
            // Add faculty to the Set for filtering
            faculties.add(facultyName);
            
            if (!groupedData[facultyName]) {
                groupedData[facultyName] = {};
            }
            
            if (!groupedData[facultyName][projectName]) {
                groupedData[facultyName][projectName] = {
                    domain: project.domain,
                    startDate: new Date(project.startDate),
                    projectId: project.projectId,
                    students: []
                };
            }
            
            // Add student if not already added
            if (!groupedData[facultyName][projectName].students.includes(project.studentName)) {
                groupedData[facultyName][projectName].students.push(project.studentName);
            }
        });
        
        return groupedData;
    }
    
    // Function to render projects to DOM
    function renderProjects(groupedData) {
        // Clear container
        projectsContainer.innerHTML = '';
        
        // Check if there are no projects
        if (Object.keys(groupedData).length === 0) {
            projectsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 48px; color: #dee2e6; margin-bottom: 20px;"></i>
                    <p>No projects found. Try different search criteria or add a new project.</p>
                </div>
            `;
            return;
        }
        
        // Create HTML for each faculty and their projects
        Object.keys(groupedData).sort().forEach(faculty => {
            const facultySection = document.createElement('div');
            facultySection.className = 'faculty-section';
            
            // Faculty header
            const facultyHeader = document.createElement('div');
            facultyHeader.className = 'faculty-header';
            facultyHeader.textContent = `Faculty: ${faculty}`;
            facultySection.appendChild(facultyHeader);
            
            // Projects for this faculty
            Object.keys(groupedData[faculty]).sort().forEach(project => {
                const projectData = groupedData[faculty][project];
                
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                // Project title and domain
                const projectTitle = document.createElement('div');
                projectTitle.className = 'project-title';
                projectTitle.innerHTML = `
                    <span>${project} <span class="project-domain">${projectData.domain}</span></span>
                `;
                projectCard.appendChild(projectTitle);
                
                // Project start date
                const projectDate = document.createElement('div');
                projectDate.className = 'project-date';
                projectDate.textContent = `Started: ${projectData.startDate.toDateString()}`;
                projectCard.appendChild(projectDate);
                
                // Student list
                const studentList = document.createElement('ul');
                studentList.className = 'student-list';
                
                projectData.students.sort().forEach(student => {
                    const studentItem = document.createElement('li');
                    studentItem.className = 'student-item';
                    studentItem.innerHTML = `<i class="fas fa-user-graduate"></i> ${student}`;
                    studentList.appendChild(studentItem);
                });
                
                projectCard.appendChild(studentList);
                facultySection.appendChild(projectCard);
            });
            
            projectsContainer.appendChild(facultySection);
        });
    }
    
    // Function to populate faculty filter
    function populateFacultyFilter() {
        // Clear current options (except "All")
        while (facultyFilter.options.length > 1) {
            facultyFilter.remove(1);
        }
        
        // Add faculties as options
        [...faculties].sort().forEach(faculty => {
            const option = document.createElement('option');
            option.value = faculty;
            option.textContent = faculty;
            facultyFilter.appendChild(option);
        });
    }
    
    // Function to filter projects based on user input
    function filterProjects() {
        const facultyValue = facultyFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        
        // Filter projects
        const filteredProjects = allProjects.filter(project => {
            // Faculty filter
            if (facultyValue && project.facultyName !== facultyValue) {
                return false;
            }
            
            // Search filter (project name or student name)
            if (searchValue && !project.projectName.toLowerCase().includes(searchValue) && 
                !project.studentName.toLowerCase().includes(searchValue)) {
                return false;
            }
            
            return true;
        });
        
        // Group and render filtered projects
        const groupedFilteredProjects = groupProjectsByFaculty(filteredProjects);
        renderProjects(groupedFilteredProjects);
    }
    
    // Function to print report
    function printReport() {
        fetch('http://localhost:5000/api/print-active-projects')
            .then(response => response.json())
            .then(data => {
                alert(`Report printed to server console with ${data.count} mappings`);
            })
            .catch(error => {
                console.error('Error printing report:', error);
                alert('Error printing report. Check server logs.');
            });
    }
    
    // Initial load of projects
    async function initialize() {
        allProjects = await fetchActiveProjects();
        const groupedProjects = groupProjectsByFaculty(allProjects);
        
        // Populate faculty filter
        populateFacultyFilter();
        
        // Render projects
        renderProjects(groupedProjects);
    }
    
    // Event listeners
    facultyFilter.addEventListener('change', filterProjects);
    searchInput.addEventListener('input', filterProjects);
    printBtn.addEventListener('click', printReport);
    
    // Initialize
    initialize();
});