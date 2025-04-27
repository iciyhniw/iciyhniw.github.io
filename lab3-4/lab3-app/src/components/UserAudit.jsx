import{getAuth, onAuthStateChanged} from "firebase/auth";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User ID: ", user.uid);
        console.log("Email: ", user.email);
        console.log("Display Name: ", user.displayName);
        console.log("Profile Photo URL: ", user.photoURL);
    } else{
        console.log("No user is currently logged in.");
    }
});