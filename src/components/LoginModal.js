import './LoginModal.css'
import React from 'react'
import { useState, useEffect } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext'

const LoginModal = (props) => {

  const { authUser } = useUserAuth();
  const { logIn } = useUserAuth()
  const [user, setUser] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [showModal, setShowModal] = useState(true)


  useEffect(() => {
    if (authUser != null) {
      setShowModal(false)
    } else {
      setShowModal(true)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await logIn(user.email, password.password)
    } catch (err) {
      setError(err.message)
    }


  }
  if (showModal) {
    return (
      <div className="modal--container--login">
        <h1>Log in and start chatting.</h1>
        <form onSubmit={handleSubmit}>
          {error && <h5>{error}</h5>}
          <input onChange={handleChange} name="email" placeholder="email@address.com"></input>
          <input onChange={handlePassword} name="password" placeholder="password" type="password"></input>
          <br></br>
          <button>Submit</button>
          <h5>New user? <span onClick={() => { props.setNewUser(true) }} className='signup--button'>Sign up now.</span></h5>
        </form>
      </div>
    )
  }
}

export default LoginModal