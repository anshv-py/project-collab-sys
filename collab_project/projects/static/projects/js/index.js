// Function to open a modal by ID
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

// Function to close a modal by ID
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Function to handle closing modals when clicking outside the modal content
function setupModalCloseOnClick() {
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    };
}

// Function to enable smooth scrolling for navigation links
function setupSmoothScrolling() {
    const links = document.querySelectorAll("nav ul li a");
    
    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default anchor action
            
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: "smooth"
                });
            }
        });
    });
}

// Function to set up profile icon dropdown functionality
function setupProfileDropdown() {
    const profileBtn = document.getElementById("profileBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    // Toggle dropdown on button click
    profileBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent click from bubbling up
        dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!profileBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
}

// Function to open project details modal with title, description, and optional image
function openProjectDetails(title, description, imageUrl) {
    console.log("Opening project modal..."); // Debugging

    const modal = document.getElementById("projectModal");
    document.getElementById("modalProjectTitle").innerText = title;
    document.getElementById("modalProjectDescription").innerText = description;
    
    const imageElement = document.getElementById("modalProjectImage");

    if (imageUrl && imageUrl.trim() !== "") {
        console.log("Setting image source:", imageUrl); // Debugging
        imageElement.src = imageUrl;
        imageElement.style.display = "block"; // Show image if available
    } else {
        console.log("No image provided, hiding image element"); // Debugging
        imageElement.style.display = "none"; // Hide image if no URL is provided
    }

    modal.style.display = "flex";
}

// Ensure DOM is fully loaded before attaching event listener
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded, setting up event listeners");

    document.addEventListener("click", function (event) {
        const button = event.target.closest(".learn-more"); // Ensure the click is on the button

        if (!button) {
            console.log("Click detected, but not on 'Learn More' button");
            return;
        }

        console.log("'Learn More' button clicked!", button);

        const card = button.closest(".project-card"); // Find the parent project card
        if (!card) {
            console.error("No project card found for this button");
            return;
        }

        const title = card.getAttribute("data-title");
        const description = card.getAttribute("data-description");
        const imageUrl = card.getAttribute("data-image");

        console.log("Opening modal with:", title, description, imageUrl);
        openProjectDetails(title, description, imageUrl);
    });
});



// Function to close the project details modal
function closeProjectModal() {
    document.getElementById("projectModal").style.display = "none";
}

// Function to handle closing project modal when clicking outside content
function setupProjectModalCloseOnClick() {
    window.onclick = function(event) {
        const modal = document.getElementById("projectModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

// Initialize all event listeners when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    setupSmoothScrolling();
    setupProfileDropdown();
    setupModalCloseOnClick();
    setupProjectModalCloseOnClick();
});

// Function to redirect to Add Project page
function redirectToAddProject() {
    window.location.href = "addProject.html";
}
