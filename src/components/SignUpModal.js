import './SignUpModal.css'
import { useEffect, useState } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SignUpModal = (props) => {

    const { authUser } = useUserAuth();
    const { signUp } = useUserAuth();
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()
    const [uid, setUid] = useState()
    const [showModal, setShowModal] = useState(true)

    useEffect(() => {
        if (authUser != null) {
            setUid(authUser.uid)
            setShowModal(false)
        } else {
            setShowModal(true)
            setUid(null)
        }
    }, [authUser])

    const handleChange = (e) => {
        const { value, name } = e.target
        setUser(old => {
            return ({
                ...old,
                [name]: value
            })
        })
    }

    const handlePassword = (e) => {
        const { value, name } = e.target
        setPassword(old => {
            return ({
                ...old,
                [name]: value
            })
        })
    }

    const handlePasswordConfirm = (e) => {
        const { value, name } = e.target
        setPassword(old => {
            return ({
                ...old,
                [name]: value
            })
        })
    }

    const handleSubmit = async (e) => {
        setError("")
        const time = Date.now()
        e.preventDefault()
        if (password.password === password.confirmPassword) {
            try {
                await signUp(user.email, password.password)
                    .then((cred) => {
                        setDoc(doc(db, 'users', cred.user.uid), {
                            ...user,
                            created_at: time,
                            id: cred.user.uid,
                            description: "",
                            followers_count: null,
                            profile_image: "",
                        })
                    })
            } catch (err) {
                setError(err.message)
                console.log(error)
            }
        }
    }

    if (showModal) {
        return (
            <div className="modal--container">
                <h1>Join today and start chatting.</h1>
                <form onSubmit={handleSubmit}>
                    {error && <h5>{error}</h5>}
                    <input onChange={handleChange} name="username" placeholder="username"></input>
                    <input onChange={handleChange} name="email" placeholder="email@address.com"></input>
                    <input onChange={handlePassword} name="password" placeholder="password" type='password'></input>
                    <input onChange={handlePasswordConfirm} name="confirmPassword" placeholder="confirm password" type='password'></input>
                    <br></br>
                    <button>Submit</button>
                </form>
                <h5>Alright have an account? <span className='login--button' onClick={() => { props.setNewUser(false) }}>Login now.</span></h5>
            </div>
        )
    }
}

export default SignUpModal