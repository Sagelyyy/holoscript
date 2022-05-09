import './PostFeed.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useEffect, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

const PostFeed = () => {

    const { authUser } = useUserAuth()
    const [postData, setPostData] = useState()

    useEffect(() => {
        if(authUser != null){
            getPostData()
        }
    },[authUser])

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

    const postElements = postData?.scripts.map((item) => {
        return(
            <div className='postFeed--container'>
                <h3 className='postFeed--user'>{item.user}</h3>
                <h4 className='postFeed--content'>{item.post}</h4>
                <p>TODO: ADD BUTTONS!</p>
            </div>
        )
    })


    return (
        <div className='postFeed--content--container'>
            {postElements}
        </div>

    )
}

export default PostFeed