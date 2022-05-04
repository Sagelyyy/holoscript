import { useState } from "react"



const LoginModal = () => {

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