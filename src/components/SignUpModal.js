import './SignUpModal.css'
import { useContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import GlobalUser from "../contexts/GlobalUser";
import { setDoc, doc } from 'firebase/firestore';

const SignUpModal = () => {

    const [user, setUser] = useContext(GlobalUser)
    const [localUser, setLocalUser] = useState()
    const [password, setPassword ] = useState()

    const handleChange = (e) => {
        const { name, value } = e.target
        setLocalUser(old => {
            return ({
                ...old,
                [name]: value,
                id: null,
                id_str: "",
                description: "",
                followers_count: null,
                created_at: "",
                profile_image: "",
            })
        })
    }

    const handlePassword = (e) => {
        const {name, value} = e.target
        setPassword(old => {
            return({
                ...old,
                [name]: value
            })
      
        })
    }

    const writeUserData = async (userData) => {
        const docRef = await setDoc(doc(db, "users", userData.uid), user)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setUser(localUser)
       
        createUserWithEmailAndPassword(auth, localUser.email, password.password)
            .then((userCredential) => {
                const newUser = userCredential.user;
                writeUserData(newUser)
            })
    }

    return (
        <div className="modal--container">
            <h1>Join today and start chatting.</h1>
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} name="username" placeholder="username"></input>
                <input onChange={handleChange} name="email" placeholder="email@address.com"></input>
                <input onChange={handlePassword} name="password" placeholder="password" type='password'></input>
                <input onChange={handleChange} placeholder="confirm password" type='password'></input>
                <br></br>
                <button>Submit</button>
            </form>
            <h5>Alright have an account? Login now.</h5>
        </div>
    )
}

export default SignUpModal