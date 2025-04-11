document.addEventListener('DOMContentLoaded', () => {
    const profileImageUpload = document.getElementById('profileImageUpload');
    const profileImagePreview = document.getElementById('profileImagePreview');
    const editProfileBtn = document.getElementById('editProfile');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtn = document.querySelector('.close-btn');
    const profileForm = document.getElementById('profileForm');

    // Profile Image Upload
    profileImageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileImagePreview.src = event.target.result;
                profileImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Edit Profile Modal
    editProfileBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'block';
    });

    // Close Modal
    closeModalBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'none';
    });

    // Close modal if clicked outside
    window.addEventListener('click', (e) => {
        if (e.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });

    // Profile Form Submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Update profile details
        document.getElementById('profileName').textContent = 
            document.getElementById('fullName').value;
        document.getElementById('nameOutput').textContent = 
            document.getElementById('fullName').value;
        document.getElementById('emailOutput').textContent = 
            document.getElementById('email').value;
        document.getElementById('phoneOutput').textContent = 
            document.getElementById('phone').value;
        document.getElementById('mobileOutput').textContent = 
            document.getElementById('mobile').value;
        document.getElementById('addressOutput').textContent = 
            document.getElementById('address').value;

        // Update social media links
        const socialProfiles = [
            { id: 'githubProfile', linkId: 'githubLink' },
            { id: 'twitterProfile', linkId: 'twitterLink' },
            { id: 'linkedinProfile', linkId: 'linkedinLink' },
            { id: 'instagramProfile', linkId: 'instagramLink' }
        ];

        socialProfiles.forEach(profile => {
            const profileUrl = document.getElementById(profile.id).value;
            const socialLink = document.getElementById(profile.linkId);
            
            if (profileUrl) {
                socialLink.href = profileUrl;
                socialLink.style.display = 'inline';
            } else {
                socialLink.style.display = 'none';
            }
        });

        // Close modal
        editProfileModal.style.display = 'none';
    });
});