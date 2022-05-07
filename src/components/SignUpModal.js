import './SignUpModal.css'
import { useContext, useEffect, useState } from "react"
import { auth, db } from "../firebase";
import { setDoc, doc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useUserAuth } from '../contexts/UserAuthContext';

const SignUpModal = (props) => {
    const [uid, setUid] = useState()
    const [localUser, setLocalUser] = useState({
        created_at: null,
        id: null,
        description: "",
        followers_count: null,
        profile_image: "",
    })
    const [password, setPassword] = useState()
    const [error, setError] = useState()
    const { signUp } = useUserAuth();
    let { authUser } = useUserAuth();

    useEffect(() => {
        if (localUser.created_at !== null) {
            if (uid) {
                writeUserData(uid)
            }
        }
    }, [uid])

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

    const writeUserData = async (userId) => {
        await setDoc(doc(db, "users", userId), { ...localUser })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const time = Date.now()
        const newId = nanoid()
        setLocalUser((old) => {
            return ({
                ...old,
                created_at: time,
                id: newId,
                description: "",
                followers_count: null,
                profile_image: "",
            })
        })
        handleSignUp()
    }

    const handleSignUp = async () => {
        if (password.password === password.confirmPassword) {
            setError('')
            try {
                const result = await signUp(localUser.email, password.password)
                setUid(result.user.uid)
            } catch (err) {
                setError(err.message)
            } finally {
            }
        } else {
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
                <h5>Alright have an account? <span className='login--button' onClick={() => { props.setNewUser(false) }}>Login now.</span></h5>
            </div>
        )
}

export default SignUpModal