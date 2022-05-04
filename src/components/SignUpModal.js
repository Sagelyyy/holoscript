import './SignUpModal.css'
import { useContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import GlobalUser from "../contexts/GlobalUser";
import { setDoc, doc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

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
            })
        })
    }

    console.log(localUser)
    console.log(user)

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
        console.log('DocREF: ' + docRef)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const date = new Date()
        const time = date.getTime().toString()
        const newId = nanoid()
        setUser(old => {
            return({
                ...localUser,
                created_at: time,
                id: newId,
                description: "",
                followers_count: null,
                profile_image: "",

            })
        })

        createNewuser()
    }

    const createNewuser = () => {
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
                <input placeholder="confirm password" type='password'></input>
                <br></br>
                <button>Submit</button>
            </form>
            <h5>Alright have an account? Login now.</h5>
        </div>
    )
}

export default SignUpModal