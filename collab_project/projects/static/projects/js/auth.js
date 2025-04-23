document.addEventListener("DOMContentLoaded", function () {
    var modeField = document.getElementById("mode");
    const formTitle = document.getElementById("form-title");
    const toggleText = document.getElementById("toggle-text");
    const toggleBtn = document.getElementById("toggle-btn");
    const details = document.getElementById("details");
    const submitBtn = document.querySelector(".btn");
    const form = document.getElementById("auth-form");

    let isLogin = true;
    function toggleAuth() {
        isLogin = !isLogin;
        document.body.setAttribute("data-mode", isLogin ? "login" : "signup");
        modeField.setAttribute('value', isLogin ? 'login' : 'signup');
        formTitle.textContent = isLogin ? "Sign In" : "Sign Up";
        submitBtn.textContent = isLogin ? "Login" : "Register";

        toggleText.childNodes[0].nodeValue = isLogin
            ? "Don't have an account? "
            : "Already have an account? ";
        toggleBtn.textContent = isLogin ? "Sign Up" : "Sign In";
    }
    toggleBtn.addEventListener("click", toggleAuth);

    // ✅ Form submission
    form.addEventListener("submit", function (e) {
        const role = document.querySelector('input[name="role"]:checked');

        if (!role) {
            alert("Please select if you are a student or faculty.");
            return;
        }

        if (role.value === "faculty") {
            window.location.href = "faculty/dashboard/";
        } else {
            window.location.href = "student/dashboard/";
        }
    });
});
