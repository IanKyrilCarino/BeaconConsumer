document.addEventListener('DOMContentLoaded', async () => {
    // Wait until Supabase is initialized
    if (!window.supabase) {
        await waitForSupabase();
    }

    initializeLogin();
});

function waitForSupabase(timeout = 5000) {
    return new Promise((resolve, reject) => {
        const interval = 50;
        let waited = 0;
        const check = () => {
            if (window.supabase) {
                resolve();
            } else if (waited >= timeout) {
                reject(new Error('Supabase not initialized in time'));
            } else {
                waited += interval;
                setTimeout(check, interval);
            }
        };
        check();
    });
}

function initializeLogin() {
    const loginButton = document.getElementById('login-button');
    const guestButton = document.getElementById('guest-button');
    const forgotPasswordBtn = document.getElementById('forgot-password-link');

    if (loginButton) loginButton.addEventListener('click', loginUser);
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', handleForgotPassword);
    }
    if (guestButton) guestButton.addEventListener('click', e => {
        e.preventDefault();
        continueAsGuest();
    });
}

async function loginUser(e) {
    e?.preventDefault();

    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;

    if (!identifier || !password) {
        alert('Enter email and password');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier, 
            password
        });

        if (error) {
            alert('Login failed: ' + error.message);
            return;
        }

        const user = data.user;
        if (!user) {
            alert('Login failed: no user returned');
            return;
        }

        currentUser = {
            id: user.id,
            email: user.email,
            firstName: user.user_metadata?.firstName || '',
            lastName: user.user_metadata?.lastName || '',
            mobile: user.user_metadata?.mobile || ''
        };

        // ✅ Remove guest flag on successful login
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.removeItem('guest');

        // Redirect to main page
        window.location.href = 'index.html';

    } catch (err) {
        console.error(err);
        alert('Login error: ' + err.message);
    }
}


function continueAsGuest() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.setItem('guest', 'true');
    window.location.href = 'index.html';
}

async function handleForgotPassword(e) {
    e.preventDefault();

    // 1. Get the email from the existing input field
    const email = document.getElementById('login-identifier').value.trim();

    // 2. Validate
    if (!email) {
        alert("Please enter your email address in the box above so we know where to send the reset link.");
        return;
    }

    // 3. Send Reset Request to Supabase
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            // This is where the user goes after clicking the email link.
            // You'll need a page to handle the new password input (e.g., reset.html)
            redirectTo: window.location.origin + '/update-password.html' 
        });

        if (error) throw error;

        alert(`Check your email (${email}) for the password reset link!`);

    } catch (err) {
        console.error("Reset Password Error:", err);
        alert('Error sending reset link: ' + err.message);
    }
}
