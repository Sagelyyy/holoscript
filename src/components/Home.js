import './Home.css'
import Post from './Post'
import SignUpModal from './SignUpModal'
import { useContext } from 'react'
import LoginModal from './LoginModal'

const Home = () => {

    return (
        <div className="home--container">
            <h1 style={{color: 'white'}}>Home</h1>
            <Post />
            <SignUpModal />
            <LoginModal />
        </div>

    )
}

export default Home