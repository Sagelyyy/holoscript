import './SignUpModal.css'
import { useContext, useEffect, useState } from "react"
import { auth, db } from "../firebase";
import { setDoc, doc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useUserAuth } from '../contexts/UserAuthContext';

const SignUpModal = (props) => {
    const [user, setUser] = useState()
    const [localUser, setLocalUser] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()
    const { signUp } = useUserAuth();
    const { authUser } = useUserAuth();

    useEffect(() => {
        if(authUser && user){
            writeUserData(authUser.uid, user)
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setLocalUser(old => {
            return ({
                ...old,
                [name]: value,
            })
        })
    }

    const handlePassword = (e) => {
        const { name, value } = e.target
        setPassword(old => {
            return ({
                ...old,
                [name]: value
            })

        })
    }

    const writeUserData = async (userId, userObj) => {
        await setDoc(doc(db, "users", userId), userObj)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const date = new Date()
        const time = date.getTime().toString()
        const newId = nanoid()
        setUser({
                ...localUser,
                created_at: time,
                id: newId,
                description: "",
                followers_count: null,
                profile_image: "",
        })

        handleSignUp()
    }

    const handleSignUp = async () => {
        if (password.password === password.confirmPassword) {
            setError('')
            try {
                await signUp(localUser.email, password.password)
            } catch (err) {
                setError(err.message)
            }
        }else{
            setError('Passwords must match')
        }
    }


    return (
        <div className="modal--container">
            <h1>Join today and start chatting.</h1>
            {error && <h5>{error}</h5>}
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} name="username" placeholder="username"></input>
                <input onChange={handleChange} name="email" placeholder="email@address.com"></input>
                <input onChange={handlePassword} name="password" placeholder="password" type='password'></input>
                <input onChange={handlePassword} name="confirmPassword" placeholder="confirm password" type='password'></input>
                <br></br>
                <button>Submit</button>
            </form>
            <h5>Alright have an account? <span className='login--button' onClick={() => {props.setNewUser(false)}}>Login now.</span></h5>
        </div>
    )
}

export default SignUpModal