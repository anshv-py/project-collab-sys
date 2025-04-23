document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            dropdownMenu.classList.toggle('show');
        });
    }
    ``
    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.profile-icon') && !event.target.matches('.fa-user-circle')) {
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        }
    });
    
    // Image preview functionality
    const projectImage = document.getElementById('projectImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (projectImage) {
        projectImage.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle student count changes
    const studentCount = document.getElementById('studentCount');
    const studentsContainer = document.getElementById('studentsContainer');
    const addStudentBtn = document.getElementById('addStudentBtn');
    
    if (studentCount && studentsContainer) {
        studentCount.addEventListener('change', function() {
            updateStudentInputs(parseInt(this.value));
        });
    }
    
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', function() {
            addStudentInput();
        });
    }
    
    // Handle form submission
    const addProjectForm = document.getElementById('addProjectForm');
    
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            const formData = new FormData();
            
            // Add text fields
            formData.append('projectName', document.getElementById('projectName').value);
            formData.append('projectDomain', document.getElementById('projectDomain').value);
            formData.append('projectStartDate', document.getElementById('projectStartDate').value);
            formData.append('projectDescription', document.getElementById('projectDescription').value);
            
            // Add image if selected
            const imageFile = document.getElementById('projectImage').files[0];
            if (imageFile) {
                formData.append('projectImage', imageFile);
            }
            
            // Add students
            const studentInputs = document.querySelectorAll('input[name="students[]"]');
            const students = [];
            studentInputs.forEach(input => {
                if (input.value.trim() !== '') {
                    students.push(input.value.trim());
                }
            });
            
            formData.append('students', JSON.stringify(students));
            formData.append('studentCount', students.length);
        });
    }
});

function addStudentInput() {
    const studentInputs = document.querySelectorAll('.student-input');
    const studentsContainer = document.getElementById('studentsContainer');

    // Clone the first select element
    const firstSelect = studentsContainer.querySelector('select');
    const newStudentInput = document.createElement('div');
    newStudentInput.className = 'student-input';

    // Clone select options
    const clonedSelect = firstSelect.cloneNode(true);
    clonedSelect.required = true;

    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-student-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.onclick = function () {
        removeStudentInput(this);
    };

    // Append cloned select and button
    newStudentInput.appendChild(clonedSelect);
    newStudentInput.appendChild(removeBtn);

    studentsContainer.appendChild(newStudentInput);

    // Update student count
    document.getElementById('studentCount').value = studentInputs.length + 1;
}

function removeStudentInput(button) {
    const studentInput = button.parentElement;
    const studentsContainer = studentInput.parentElement;

    studentsContainer.removeChild(studentInput);

    // Update student count
    const studentInputs = document.querySelectorAll('.student-input');
    document.getElementById('studentCount').value = studentInputs.length;
}

function updateStudentInputs(count) {
    const studentsContainer = document.getElementById('studentsContainer');
    let currentInputs = studentsContainer.querySelectorAll('.student-input');
    const firstSelect = studentsContainer.querySelector('select');

    // Add missing selects
    while (currentInputs.length < count) {
        const newInput = document.createElement('div');
        newInput.className = 'student-input';

        const clonedSelect = firstSelect.cloneNode(true);
        clonedSelect.required = true;

        if (currentInputs.length > 0) {
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-student-btn';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.onclick = function () {
                removeStudentInput(this);
            };
            newInput.appendChild(clonedSelect);
            newInput.appendChild(removeBtn);
        } else {
            newInput.appendChild(clonedSelect);
        }

        studentsContainer.appendChild(newInput);
        currentInputs = studentsContainer.querySelectorAll('.student-input');
    }

    // Remove excess selects
    while (currentInputs.length > count) {
        studentsContainer.removeChild(currentInputs[currentInputs.length - 1]);
        currentInputs = studentsContainer.querySelectorAll('.student-input');
    }

    document.getElementById('studentCount').value = currentInputs.length;
}