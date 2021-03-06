import './SignUpModal.css'
import { useEffect, useState } from 'react'
import { useUserAuth, } from '../contexts/UserAuthContext'
import { doc, setDoc, collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const SignUpModal = (props) => {

    const { authUser } = useUserAuth();
    const { signUp } = useUserAuth();
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()
    const [uid, setUid] = useState()
    const [showModal, setShowModal] = useState(true)
    const [allusers, setAllUsers] = useState()

    useEffect(() => {
        if (authUser != null) {
            setUid(authUser.uid)
            setShowModal(false)
        } else {
            setShowModal(true)
            getUserList()
            setUid(null)
        }
    }, [authUser])

    const getUserList = async () => {
        const q = query(collection(db, "users"));
        const userList = []
        const usernameList = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            userList.push(doc.data())
        });

        userList.map(item => {
            usernameList.push(item.username.toLowerCase())
        })

        setAllUsers(usernameList)
    }

    const handleChange = (e) => {
        const { name, value, maxLength } = e.target
        const nameLimit = value.slice(0, maxLength)
        setUser(old => {
            return ({
                ...old,
                [name]: nameLimit
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

    const validateUsername = (arr, user) => {
        return allusers.some(arrVal => user.username.toLowerCase() === arrVal);
    }

    const handleSubmit = async (e) => {
        setError("")
        const time = Date.now()
        e.preventDefault()
        if (!validateUsername(allusers, user)) {
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
                                followed_by: [],
                                following: [],
                                messages: [],
                                profile_image: "https://firebasestorage.googleapis.com/v0/b/holoscript-b4ec7.appspot.com/o/images%2Fusers%2Fdefault%2FnewUser.jpg?alt=media&token=55eecec7-abdd-41b0-90dc-bedea86ec998",
                                posts: [],
                                replies: []
                            })
                        })
                } catch (err) {
                    setError(err.message)
                    console.log(error)
                }
            }
        }
        else {
            setError('Username taken')
        }
    }

    if (showModal) {
        return (
            <div className="modal--container">
                <h1 className='modal--title'>HoloScript</h1>
                <h2>Join today and start chatting.</h2>
                <form onSubmit={handleSubmit}>
                    {error && <h5>{error}</h5>}
                    <input onChange={handleChange} required maxLength="15" name="username" placeholder="username"></input>
                    <input onChange={handleChange} required maxLength="40" name="email" placeholder="email@address.com"></input>
                    <input onChange={handlePassword} required name="password" placeholder="password" type='password'></input>
                    <input onChange={handlePasswordConfirm} required name="confirmPassword" placeholder="confirm password" type='password'></input>
                    <br></br>
                    <button>Submit</button>
                </form>
                <h5>Alright have an account? <span className='login--button' onClick={() => { props.setNewUser(false) }}>Login now.</span></h5>
            </div>
        )
    }
}

export default SignUpModal