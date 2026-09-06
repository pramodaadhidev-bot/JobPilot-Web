/* =========================================================
   JOBPILOT - FIREBASE AUTHENTICATION
   ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAFhxa0UYCDyswOyuAF-qFn0rVs3cx92yw",
    authDomain: "jobrecommendationsystem-ca77e.firebaseapp.com",
    projectId: "jobrecommendationsystem-ca77e",
    storageBucket: "jobrecommendationsystem-ca77e.firebasestorage.app",
    messagingSenderId: "822960726251",
    appId: "1:822960726251:web:a1366dc9e4cc13342c1eae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


/* =========================================================
   LOGIN
   ========================================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");
        const loginBtn = document.getElementById("loginBtn");
        const message = document.getElementById("loginMessage");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        message.textContent = "";

        loginBtn.disabled = true;
        loginBtn.textContent = "Signing in...";

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            message.textContent = "Login successful!";

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Login error:", error);

            let errorMessage = "Login failed. Please check your email and password.";

            if (error.code === "auth/invalid-credential") {
                errorMessage = "Incorrect email or password.";
            } else if (error.code === "auth/user-not-found") {
                errorMessage = "No account found with this email.";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "Incorrect password.";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Too many attempts. Please try again later.";
            }

            message.textContent = errorMessage;

            loginBtn.disabled = false;
            loginBtn.textContent = "Sign In";
        }

    });
}


/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", function() {

        const passwordInput =
            document.getElementById("loginPassword");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "◉";

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "◉";
        }

    });
}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

const forgotPassword =
    document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", async function(event) {

        event.preventDefault();

        const emailInput =
            document.getElementById("loginEmail");

        const message =
            document.getElementById("loginMessage");

        const email = emailInput.value.trim();

        if (!email) {

            message.textContent =
                "Enter your email address first.";

            emailInput.focus();

            return;
        }

        try {

            await sendPasswordResetEmail(
                auth,
                email
            );

            message.textContent =
                "Password reset email sent. Check your inbox.";

        } catch (error) {

            console.error(
                "Password reset error:",
                error
            );

            message.textContent =
                "Unable to send reset email. Please check the email address.";

        }

    });
}


/* =========================================================
   LOGOUT
   ========================================================= */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async function() {

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    });
}


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(auth, function(user) {

    const currentPage =
        window.location.pathname.split("/").pop();

    if (
        user &&
        (
            currentPage === "login.html" ||
            currentPage === "register.html"
        )
    ) {
        window.location.href = "dashboard.html";
    }

});


/* =========================================================
   MAKE AUTH AVAILABLE TO OTHER JOBPILOT SCRIPTS
   ========================================================= */

window.JobPilotAuth = {
    auth,
    app
};


/* =========================================================
   REGISTER
   ========================================================= */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const firstName =
            document.getElementById("registerFirstName").value.trim();

        const lastName =
            document.getElementById("registerLastName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("registerConfirmPassword").value;

        const registerBtn =
            document.getElementById("registerBtn");

        const message =
            document.getElementById("registerMessage");


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            message.className =
                "auth-message error";

            return;
        }


        if (password.length < 6) {

            message.textContent =
                "Password must be at least 6 characters.";

            message.className =
                "auth-message error";

            return;
        }


        try {

            registerBtn.disabled = true;
            registerBtn.textContent = "CREATING ACCOUNT...";

            message.textContent = "";


            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            /*
             * Store the user's name in Firebase Authentication.
             * This does not create fake profile data.
             */
            const fullName =
                `${firstName} ${lastName}`.trim();


            if (fullName) {

                const { updateProfile } =
                    await import(
                        "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
                    );

                await updateProfile(user, {
                    displayName: fullName
                });
            }


            message.textContent =
                "Account created successfully.";

            message.className =
                "auth-message success";


            setTimeout(function() {

                window.location.href =
                    "dashboard.html";

            }, 800);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            let errorMessage =
                "Unable to create account.";

            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                errorMessage =
                    "An account with this email already exists.";

            } else if (
                error.code ===
                "auth/invalid-email"
            ) {

                errorMessage =
                    "Please enter a valid email address.";

            } else if (
                error.code ===
                "auth/weak-password"
            ) {

                errorMessage =
                    "Password is too weak.";

            }


            message.textContent =
                errorMessage;

            message.className =
                "auth-message error";


            registerBtn.disabled = false;
            registerBtn.textContent =
                "CREATE ACCOUNT";
        }

    });
}


/* =========================================================
   REGISTER PASSWORD VISIBILITY
   ========================================================= */

function setupPasswordToggle(buttonId, inputId) {

    const button =
        document.getElementById(buttonId);

    const input =
        document.getElementById(inputId);


    if (!button || !input) {
        return;
    }


    button.addEventListener("click", function() {

        if (input.type === "password") {

            input.type = "text";
            button.textContent = "HIDE";
            button.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            input.type = "password";
            button.textContent = "SHOW";
            button.setAttribute(
                "aria-label",
                "Show password"
            );
        }

    });
}


setupPasswordToggle(
    "toggleRegisterPassword",
    "registerPassword"
);

setupPasswordToggle(
    "toggleConfirmPassword",
    "registerConfirmPassword"
);

