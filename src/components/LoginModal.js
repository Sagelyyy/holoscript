import { useState } from "react"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


const LoginModal = () => {

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });

    return(
        <div className="modal--container">
            <h1>Login and start chatting.</h1>
            <input placeholder="email@address.com"></input>
            <input placeholder="password"></input>
            <h5>New user? Sign up now.</h5>
        </div>
    )
}

export default LoginModal