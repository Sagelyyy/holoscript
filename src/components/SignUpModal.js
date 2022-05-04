import { useState } from "react"


const SignUpModal = () => {
    return(
        <div className="modal--container">
            <h1>Join today and start chatting.</h1>
            <input placeholder="email@address.com"></input>
            <input placeholder="password"></input>
            <h5>Alright have an account? Login now.</h5>
        </div>
    )
}

export default SignUpModal