import {signInWithEmailAndPassword} from "firebase/auth";

async function login(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in: " + userCredential.user.email);
    } catch(error){
        alert("Error: " + error.message);
    }
}