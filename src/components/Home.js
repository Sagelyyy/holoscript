import './Home.css'
import Post from './Post'
import SignUpModal from './SignUpModal'
import GlobalUser from '../contexts/GlobalUser'
import { useContext } from 'react'

const Home = () => {

    const [user, setUser] = useContext(GlobalUser)

    return (
        <div className="home--container">
            <h1 style={{color: 'white'}}>Home</h1>
            <Post />
            <SignUpModal />
        </div>

    )
}

export default Home