document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-project-form');
    const numberOfStudentsInput = document.getElementById('numberOfStudents');
    const studentInputsContainer = document.getElementById('studentInputs');
    const alertDiv = document.getElementById('alert');
    
    let currentStudentCount = 1;
    
    // Function to show alert
    function showAlert(message, type) {
        alertDiv.textContent = message;
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.display = 'block';
        
        // Hide alert after 5 seconds
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    }
    
    // Function to update student input fields based on number of students
    function updateStudentInputs() {
        const numStudents = parseInt(numberOfStudentsInput.value) || 1;
        
        // Keep existing values
        const existingValues = [];
        const currentInputs = studentInputsContainer.querySelectorAll('input');
        currentInputs.forEach(input => {
            existingValues.push(input.value);
        });
        
        // Clear current inputs
        studentInputsContainer.innerHTML = '';
        
        // Add new inputs
        for (let i = 0; i < numStudents; i++) {
            const studentInputDiv = document.createElement('div');
            studentInputDiv.className = 'student-input';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'studentName';
            input.placeholder = `Student ${i + 1} Name`;
            input.required = true;
            
            // Preserve existing value if available
            if (i < existingValues.length) {
                input.value = existingValues[i];
            }
            
            studentInputDiv.appendChild(input);
            studentInputsContainer.appendChild(studentInputDiv);
        }
        
        currentStudentCount = numStudents;
    }
    
    // Listen for changes to number of students
    numberOfStudentsInput.addEventListener('change', updateStudentInputs);
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // Collect form data
            const projectName = document.getElementById('projectName').value;
            const domain = document.getElementById('domain').value;
            const facultySupervisor = document.getElementById('facultySupervisor').value;
            const startDate = document.getElementById('startDate').value;
            const numberOfStudents = parseInt(numberOfStudentsInput.value);
            
            // Collect all student names
            const studentNames = [];
            const studentInputs = document.querySelectorAll('input[name="studentName"]');
            studentInputs.forEach(input => {
                studentNames.push(input.value.trim());
            });
            
            // Validate student count matches
            if (studentNames.length !== numberOfStudents) {
                showAlert(`Number of student names (${studentNames.length}) doesn't match the specified number of students (${numberOfStudents})`, 'error');
                return;
            }
            
            // Create project object
            const projectData = {
                projectName,
                domain,
                facultySupervisor,
                startDate,
                numberOfStudents,
                studentNames
            };
            
            // Send data to server
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showAlert('Project added successfully!', 'success');
                form.reset();
                updateStudentInputs(); // Reset student inputs
            } else {
                showAlert(`Error: ${result.message || 'Failed to add project'}`, 'error');
            }
        } catch (error) {
            console.error('Error adding project:', error);
            showAlert('Server error. Please try again later.', 'error');
        }
    });
    
    // Initialize student inputs
    updateStudentInputs();
});