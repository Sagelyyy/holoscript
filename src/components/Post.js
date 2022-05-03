import './Post.css'

const Post = () => {
    return(
        <div className="post--container">
            <textarea className='post--textarea' placeholder='Whats happening?'></textarea>
            <button className='post--button'>Submit</button>
        </div>
    )
}

export default Post