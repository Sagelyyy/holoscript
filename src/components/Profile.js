import './Profile.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useEffect, useState } from 'react'
import { getDoc, doc, onSnapshot, query, collection, where, setDoc } from 'firebase/firestore'
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import newUser from '../images/newUser.jpg'
import PostElements from './PostElements';
import ReplyModal from './ReplyModal';
import MessageModal from './MessageModal';

const Profile = () => {

    const { authUser } = useUserAuth()
    const [user, setUser] = useState()
    const [upload, showUpload] = useState()
    const [uploadFile, setUploadFile] = useState()
    const [imgPath, setImgPath] = useState()
    const [postData, setPostData] = useState()
    const [showMessageModal, setShowMessageModal] = useState()
    const [messageSelection, setMessageSelection] = useState()
    const [showReplyModal, setShowReplyModal] = useState(false)
    const [postId, setPostId] = useState()


    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            getUserImage()
            const q = query(collection(db, "allScripts"), where("posted_by", "==", authUser?.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const post = [];
                querySnapshot.forEach((doc) => {
                    post.push(doc.data());
                });
                post.sort((a, b) => a.time - b.time).reverse()
                setPostData([...post])

            });
            return unsubscribe
        }
    }, [authUser])

    useEffect(() => {
        if (imgPath != null) {
            setUser((old) => {
                return ({
                    ...old,
                    profile_image: imgPath
                })
            })
        }
    }, [imgPath])


    useEffect(() => {
        if (user) {
            writeUserImage()
        }
    }, [user?.profile_image])


    const handleMessage = (username) => {
        setMessageSelection(username)
        setShowMessageModal((old) => !old)
    }

    const handleReply = (id) => {
        setShowReplyModal(true)
        setPostId(id)
    }

    const writeUserImage = async () => {
        await setDoc(doc(db, 'users', authUser.uid), user)
    }

    const getUserImage = () => {
        const listRef = ref(storage, `/images/users/${authUser.uid}`)
        // Find all the prefixes and items.
        listAll(listRef)
            .then((res) => {
                res.prefixes.forEach((folderRef) => {
                    console.log(`folderRef `, folderRef)
                });
                res.items.forEach((itemRef) => {
                });
            }).catch((error) => {
                // Uh-oh, an error occurred!
            });
    }

    const getUserData = async () => {
        if (authUser != null) {
            const userRef = doc(db, 'users', authUser.uid)
            const docSnap = await getDoc(userRef)
            if (docSnap.exists()) {
                setUser(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such user!");
            }
        }
    }

    const handleChange = (event) => {
        setUploadFile(event.target.files[0])
    }

    const uploadData = async () => {
        //maybe import this function from outside...?

        const metadata = {
            contentType: 'image/jpeg'
        };
        const storageRef = ref(storage, `images/users/${user.id}/` + uploadFile.name)
        const uploadTask = uploadBytesResumable(storageRef, uploadFile, metadata)

        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgPath(downloadURL)
                });
            }
        );
        showUploadModal(false)
    }

    const showUploadModal = () => {
        showUpload(true)
    }
    const hideUpload = () => {
        // showUpload(false)
    }

    if (user) {
        return (
            <div onClick={hideUpload} className='profile--content--container'>
                {upload &&
                    <div className='profile--upload'>
                        <h4>Select a profile image to upload:</h4>
                        <input onChange={handleChange} type='file' name='file' />
                        <button onClick={uploadData}>Submit</button>
                    </div>}
                <div className='profile--container'>
                    {user.profile_image ? <img onClick={showUploadModal} className='profile--image' src={user.profile_image} /> :
                        <img onClick={showUploadModal} className='profile--image' src={newUser} />}
                    <h1 className='profile--username'>{user.username}</h1>
                    <h4 className='profile--followers'>Followers: {user.followers_count}</h4>
                </div>
                <div>
                    <h1 className='userScripts--title'>Your Scripts</h1>
                    {postData && <PostElements handleReply={handleReply} handleMessage={handleMessage} postData={postData} />}
                    {showReplyModal ? <ReplyModal setShowReplyModal={setShowReplyModal} postId={postId} /> : null}
                    {showMessageModal ? <MessageModal setShowMessageModal={setShowMessageModal} messageSelection={messageSelection} /> : null}
                </div>
            </div>
        )
    }

    return (
        <h1>Please Log in to view your profile.</h1>
    )
}

export default Profile