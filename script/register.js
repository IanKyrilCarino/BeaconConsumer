// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeRegister();
});

function initializeRegister() {
    const registerButton = document.getElementById('register-button');
    if (registerButton) {
        registerButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission reload
            registerUser();
        });
    }
    
    const verifyOtpButton = document.getElementById('verify-otp');
    if (verifyOtpButton) {
        verifyOtpButton.addEventListener('click', function(e) {
            e.preventDefault();
            verifyOtp();
        });
    }
}

async function registerUser() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const mobile = document.getElementById('mobile-number').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    const registerBtn = document.getElementById('register-button');

    // --- Validation ---
    if (!firstName || !lastName || !mobile || !email || !password || !confirmPassword) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!terms) {
        alert('Please accept the Terms and Conditions');
        return;
    }

    // Disable button to prevent double clicks
    registerBtn.disabled = true;
    registerBtn.textContent = "Processing...";

    // --- Supabase Sign Up ---
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // Store extra user details in metadata
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    mobile: mobile,
                    role: 'user' // Default role
                }
            }
        });

        if (error) throw error;

        // Success handling
        alert('Registration successful! Please check your email for the verification code.');
        
        // Switch UI to OTP mode
        document.getElementById('register-button').style.display = 'none';
        document.getElementById('otp-section').style.display = 'block';
        
    } catch (error) {
        console.error('Registration Error:', error);
        alert('Error registering: ' + error.message);
        registerBtn.disabled = false;
        registerBtn.textContent = "Create Account";
    }
}

async function verifyOtp() {
    const email = document.getElementById('email').value;
    const token = document.getElementById('otp-input').value;
    const verifyBtn = document.getElementById('verify-otp');
    
    if (!token) {
        alert('Please enter the OTP code');
        return;
    }

    verifyBtn.disabled = true;
    verifyBtn.textContent = "Verifying...";

    try {
        // --- Supabase OTP Verification ---
        const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: 'signup'
        });

        if (error) throw error;

        // Success: Session is now active
        alert('Email verified successfully!');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Verification Error:', error);
        alert('Invalid OTP or verification failed: ' + error.message);
        verifyBtn.disabled = false;
        verifyBtn.textContent = "Verify OTP";
    }
}