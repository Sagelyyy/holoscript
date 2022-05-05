import './Home.css'
import Post from './Post'
import SignUpModal from './SignUpModal'
import { useContext } from 'react'

const Home = () => {

    return (
        <div className="home--container">
            <h1 style={{color: 'white'}}>Home</h1>
            <Post />
            <SignUpModal />
        </div>

    )
}

export default Home