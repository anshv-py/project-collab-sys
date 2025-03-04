document.getElementById("addProjectForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Fetch form values
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const field = document.getElementById("field").value;
    const image = document.getElementById("image").files[0];

    if (!title || !description || !field || !image) {
        alert("Please fill all fields before submitting.");
        return;
    }

    // Simulating Project Addition
    alert("Project added successfully! (MongoDB integration pending)");

    // Redirect to dashboard
    window.location.href = "faculty-projects.html";
});

// Close Button Functionality
function closeForm() {
    window.location.href = "faculty-projects.html";
}
