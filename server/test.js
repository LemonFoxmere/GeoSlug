function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    function handleCredentialResponse(response) {
        // Build Firebase credential with the Google ID token.
        const idToken = response.credential;
        const credential = GoogleAuthProvider.credential(idToken);
      
        // Sign in with credential from the Google user.
        signInWithCredential(auth, credential).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The credential that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
      }
  }
