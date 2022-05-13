import './PostFeed.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useEffect, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

const PostFeed = () => {

    const { authUser } = useUserAuth()
    const [postData, setPostData] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
        if (authUser.uid != null) {
            getPostData()
            getUserData()
        }
    }, [authUser])

    const getUserData = async () => {
        if (authUser != null) {
            const userRef = doc(db, 'users', authUser?.uid)
            const docSnap = await getDoc(userRef)
            if (docSnap.exists()) {
                setUser(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such user!");
            }
        }
    }

    const getPostData = async () => {
        const postRef = doc(db, "allScripts", "scriptdata");
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
            console.log("Document data:", postSnap.data());
            setPostData(postSnap.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No posts!");
        }
    }

    const postElements = postData?.scripts.map((item, i) => {
        return (
            <div key={i} className='postFeed--container'>
                <div className='postFeed--user--container'>
                    <img className="postFeed--user--avatar" src={item.user_profile_image} />
                    <h3 className='postFeed--user--username'>{item.user}</h3>
                </div>
                <h4 className='postFeed--content'>{item.post}</h4>
                <p>TODO: ADD BUTTONS!</p>
            </div>
        )
    }).reverse()


    return (
        <div className='postFeed--content--container'>
            {postElements}
        </div>

    )
}

export default PostFeed