document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const toggleText = document.getElementById("toggle-text");
    const submitBtn = document.querySelector(".btn");
    const form = document.getElementById("auth-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    let isLogin = true;

    // Toggle Sign In & Sign Up
    function toggleAuth() {
        isLogin = !isLogin;
        
        if (isLogin) {
            formTitle.textContent = "Sign In";
            submitBtn.textContent = "Login";
            toggleText.innerHTML = 'Don\'t have an account? <span id="toggle-btn" class="toggle-link">Sign Up</span>';
        } else {
            formTitle.textContent = "Sign Up";
            submitBtn.textContent = "Register";
            toggleText.innerHTML = 'Already have an account? <span id="toggle-btn" class="toggle-link">Sign In</span>';
        }

        // Reattach event listener to the new toggle button
        document.getElementById("toggle-btn").addEventListener("click", toggleAuth);
    }

    // Attach event listener to toggle button
    document.getElementById("toggle-btn").addEventListener("click", toggleAuth);

    // Handle Form Submission
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        if (!email.includes("@")) {
            alert("Please enter a valid email address.");
            return;
        }

        const domain = email.split("@")[1];

        if (domain === "vitstudent.ac.in") {
            window.location.href = "/student/dashboard/";
        } else if (domain === "vit.ac.in") {
            window.location.href = "/faculty/dashboard/";
        } else {
            alert("Invalid email domain. Please use your institutional email.");
        }
    });
});
