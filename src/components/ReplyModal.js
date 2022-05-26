import { useState } from 'react'
import './ReplyModal.css'


const ReplyModal = (scriptId) => {

    const [error, setError] = useState()
    const [post, setPost] = useState()
    


    const handleChange = () =>{
        console.log('change')
    }

    const handleSubmit = () => {
        console.log('submit')
    }


    return(
        <div className="ReplyModal--container">
        <h3>Reply to Script.</h3>
        <form className='ReplyModal--form' onSubmit={handleSubmit}>
            {error && <h5>{error}</h5>}
            <input onChange={handleChange} name='recipient' placeholder="Who you sending it to?"></input>
            <textarea name='post' onChange={handleChange} placeholder="What are you saying?"></textarea>
            <br></br>
            <button>Submit</button>
        </form>
    </div>
    )


}


export default ReplyModal