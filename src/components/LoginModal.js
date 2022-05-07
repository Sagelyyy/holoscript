import './LoginModal.css'
import { useState } from "react"
import { useUserAuth } from "../contexts/UserAuthContext"
import { nanoid } from "nanoid"


const LoginModal = (props) => {
  const [user, setUser] = useState()
  const [localUser, setLocalUser] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState()
  const { logIn } = useUserAuth() || {};
  const { authUser } = useUserAuth()

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const date = new Date()
    const time = date.getTime().toString()
    const newId = nanoid()
    setUser(old => {
        return ({
            ...localUser,
            created_at: time,
            id: newId,
            description: "",
            followers_count: null,
            profile_image: "",

        })
    })

    handleLogin()
}

const handleLogin = async () => {
        setError('')
        try {
            await logIn(localUser.email, password.password)
        } catch (err) {
            setError(err.message)
        }
}

if(!props.newUser && !authUser){
  return (
    <div className="modal--container--login">
      <h1>Log in and start chatting.</h1>
      {error && <h5>{error}</h5>}
      <form onSubmit={handleSubmit}>
        <input name="email" onChange={handleChange} placeholder="email@address.com"></input>
        <input name="password" onChange={handlePassword} placeholder="password" type="password"></input>
        <br></br>
        <button>Submit</button>
        <h5>New user? <span className='signup--button' onClick={() => {props.setNewUser(true)}}>Sign up now.</span></h5>
      </form>
    </div>
  )
}
}

export default LoginModal