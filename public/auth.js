import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
        //import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
        import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
        import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
        import firebaseConfig from './config.js';
       
         
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        //const analytics = getAnalytics(app);
        const db = getFirestore(app);
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        auth.language = 'en';
        const user = auth.currentUser;
        const googleLogout = document.getElementById("google-logout-btn");
        const signOutMessage = document.getElementById("sign-out-message");

        googleLogout.addEventListener("click", handleSignOut);
        const googleLogin = document.getElementById("google-login-btn");
        googleLogin.addEventListener("click", handleSignIn);
        // Listen for changes in the user's authentication state
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, update the user profile
                updateUserProfile(user);

                signOutMessage.innerText = '';
                document.getElementById('google-logout-btn').style.display = 'block';
                document.getElementById('google-login-btn').style.display = 'none';
                document.getElementById('userProfilePicture').style.display = 'block';
            } else {
                document.getElementById('google-logout-btn').style.display = 'none';
                document.getElementById('google-login-btn').style.display = 'block';
                document.getElementById('userProfilePicture').style.display = 'none';
                clearUserInfo();
                displayLoginMessage();
                console.log("No user signed in");
            }
        });
        async function handleSignOut() {
            try {
                await signOut(auth);
                
                clearUserInfo();
                displayLoginMessage();
                signOutMessage.innerText = "You have been successfully signed out.";
            } catch (error) {
                signOutMessage.innerText = "An error occurred during sign-out.";
                console.error(error);
            }
        }
        function clearUserInfo() {
            // Clear user information
            document.getElementById("userName").textContent = '';
            document.getElementById("userEmail").textContent = '';
            document.getElementById("userProfilePicture").src = '';
        }
        async function handleSignIn() {
            try {
                const result = await signInWithPopup(auth, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                updateUserProfile(user);
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error(errorCode, errorMessage, credential);
            }
        }
        function updateUserProfile(user) {
            const userName = user.displayName;
            const userEmail = user.email;
            const userProfilePicture = user.photoURL;

            // Update the user's name and email in the UI
            document.getElementById("userName").textContent = `Hello, ${userName}`;
            document.getElementById("userEmail").textContent = userEmail;

            // Update the user's profile picture
            document.getElementById("userProfilePicture").src = userProfilePicture;

            // Show logout button and hide login button
            document.getElementById('google-logout-btn').style.display = 'block';
            document.getElementById('google-login-btn').style.display = 'none';
            document.getElementById('userProfilePicture').style.display = 'block';
        }
