import './Messages.css'
import { useUserAuth } from "../contexts/UserAuthContext"
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../firebase'



const Messages = () => {

    const { authUser } = useUserAuth()
    const [messages, setMessages] = useState()

    useEffect(() => {
        if (authUser?.uid != null) {
            const unsub = onSnapshot(doc(db, 'users', authUser.uid), (doc) => {
                setMessages(doc.data().messages)
            });
            return unsub
        }
    }, [authUser])

    const messageElements = messages?.map((message, i) => {
        return (
            <div key={i} className='messages--container'>
                <div className='messages--user--container'>
                    <img className="messages--user--avatar" src={message.user_profile_image} />
                    <h3 className='messages--user--username'>{message.sent_by}</h3>
                </div>
                <h4 className='messages--content'>{message.post}</h4>
                <p>TODO: ADD BUTTONS!</p>
            </div>
        )
    })


    return (
        <div className='message--content--container'>
        <h1>Messages</h1>
        {messages?.length > 0 ? messageElements : <h3>You have no messages.</h3>}
        </div>
    )
}

export default Messages