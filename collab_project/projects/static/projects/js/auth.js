document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const toggleText = document.getElementById("toggle-text");
    const toggleBtn = document.getElementById("toggle-btn");
    const submitBtn = document.querySelector(".btn");
    const form = document.getElementById("auth-form");

    let isLogin = true; // Initial state is Login

    // Toggle Sign In & Sign Up
    function toggleAuth() {
        isLogin = !isLogin;

        if (isLogin) {
            formTitle.textContent = "Sign In";
            submitBtn.textContent = "Login";
            toggleText.innerHTML = 'Don\'t have an account? <span id="toggle-btn">Sign Up</span>';
        } else {
            formTitle.textContent = "Sign Up";
            submitBtn.textContent = "Register";
            toggleText.innerHTML = 'Already have an account? <span id="toggle-btn">Sign In</span>';
        }

        // Reattach event listener to new span
        document.getElementById("toggle-btn").addEventListener("click", toggleAuth);
    }

    // Attach toggle function to toggle button
    toggleBtn.addEventListener("click", toggleAuth);

    // Redirect to index.html on form submit
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission
        window.location.href = "/home/"; // Redirect to homepage
    });
});
