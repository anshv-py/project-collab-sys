document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('toggle-btn');
    const toggleText = document.getElementById('toggle-text');
    
    let isLoginMode = true;
    
    // Function to toggle between login and signup modes
    function toggleAuthMode() {
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            // Switch to login mode
            toggleText.innerHTML = "Don't have an account? <span id='toggle-btn'>Sign Up</span>";
            authForm.innerHTML = `
                <div class="input-group">
                    <i class="fas fa-envelope"></i>
                    <input type="email" id="email" placeholder="Email" required>
                </div>
                
                <div class="input-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="password" placeholder="Password" required>
                </div>
                
                <button type="submit" class="btn">Login</button>
                
                <p id="toggle-text">Don't have an account? <span id="toggle-btn">Sign Up</span></p>
            `;
        } else {
            // Switch to signup mode
            toggleText.innerHTML = "Already have an account? <span id='toggle-btn'>Login</span>";
            authForm.innerHTML = `
                <div class="input-group">
                    <i class="fas fa-user"></i>
                    <input type="text" id="name" placeholder="Full Name" required>
                </div>
                
                <div class="input-group">
                    <i class="fas fa-envelope"></i>
                    <input type="email" id="email" placeholder="Email" required>
                </div>
                
                <div class="input-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="password" placeholder="Password" required>
                </div>
                
                <div class="input-group">
                    <i class="fas fa-user-tag"></i>
                    <select id="role" required>
                        <option value="" disabled selected>Select Role</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </select>
                </div>
                
                <button type="submit" class="btn">Sign Up</button>
                
                <p id="toggle-text">Already have an account? <span id="toggle-btn">Login</span></p>
            `;
        }
        
        // Re-attach event listener to new toggle button
        document.getElementById('toggle-btn').addEventListener('click', toggleAuthMode);
    }
    
    // Initial event listener for toggle button
    toggleBtn.addEventListener('click', toggleAuthMode);
    
    // Form submission handler
    authForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (isLoginMode) {
            // Handle login
            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Store user data in localStorage or sessionStorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    alert('Login successful!');
                    window.location.href = '/dashboard.html'; // Redirect to dashboard
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login');
            }
        } else {
            // Handle signup
            try {
                const name = document.getElementById('name').value;
                const role = document.getElementById('role').value;
                
                const response = await fetch('http://localhost:5000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, name, role })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert('Registration successful! Please login.');
                    toggleAuthMode(); // Switch back to login mode
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred during registration');
            }
        }
    });
});