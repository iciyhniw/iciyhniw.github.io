import {createUserWithEmailAndPassword} from "firebase/auth";

async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("User created: " + userCredential.user.email);
    } catch (error) {
        alert("Error: " + error.message);
    }
}