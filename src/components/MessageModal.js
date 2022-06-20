import './MessageModal.css'
import { useEffect, useState } from "react"
import { nanoid } from 'nanoid'
import { useUserAuth } from '../contexts/UserAuthContext'
import { query, collection, getDocs, arrayUnion, doc, updateDoc, getDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import { parseMedia } from '../utils/media'

const MessageModal = (props) => {
    const { authUser } = useUserAuth()
    const [error, setError] = useState()
    const [showModal, setShowModal] = useState(true)
    const [user, setUser] = useState()
    const [message, setMessage] = useState({ recipient: props.messageSelection })
    const [submitted, setSubmitted] = useState(false)
    const [recipientUser, setRecipientUser] = useState()

    const getUserList = async (recipient) => {
        const q = query(collection(db, "users"));
        const userList = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            userList.push(doc.data())
        });
        grabUser(userList, recipient)
    }

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
        } else {
            // other stuff
        }
    }, [authUser])


    useEffect(() => {
        if (!recipientUser) {
            getUserList(message.recipient)
        }
    }, [])

    useEffect(() => {
        if (submitted && message.sent_by) {
            writeMessageData(message, recipientUser)
            setSubmitted(false)
            props.setShowMessageModal(false)
        }
    }, [message])

    useEffect(() => {
    }, [recipientUser])

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

    const grabUser = (arr, recipient) => {
        const itemIndex = arr.findIndex((i) => i.username === recipient);
        if (itemIndex > -1) {
            const userList = arr.slice();
            const user = userList.splice(itemIndex, 1)
            setRecipientUser(user);
        }
    }

    const writeMessageData = async (message, user) => {
        try {
            const q = query(collection(db, 'users'), where('username', '==', user[0].username))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((usr) => {
                // doc.data() is never undefined for query doc snapshots
                const recipientRef = doc(db, 'users', usr.id)
                updateDoc(recipientRef, { "messages": arrayUnion(message) })
            })
        } catch (err) {
            setError(err.message)
            console.log(err)
        }

    }



    const handleSubmit = async (e) => {
        setMessage((old) => {
            return ({
                ...old,
                time: Date.now(),
                sent_by: user.username,
                id: nanoid(),
                user_profile_image: user?.profile_image,
                media: parseMedia(message.post)
            })
        })
        e.preventDefault()
        setSubmitted(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setMessage(old => {
            return ({
                ...old,
                [name]: value
            })
        })
    }

    if (showModal) {
        return (
            <div className="MessageModal--container">
                <h3>Send a message.</h3>
                <form className='MessageModal--form' onSubmit={handleSubmit}>
                    {error && <h5>{error}</h5>}
                    <input onChange={handleChange} name='recipient' value={message.recipient} placeholder="Who you sending it to?"></input>
                    <textarea name='post' onChange={handleChange} placeholder="What are you saying?"></textarea>
                    <br></br>
                    <button>Submit</button>
                </form>
            </div>
        )
    }
}

export default MessageModal