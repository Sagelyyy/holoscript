import './postElements.css'
import { useUserAuth } from '../contexts/UserAuthContext'


const postElements = (props) => {

    const { authUser } = useUserAuth()

    const postElements = props.postData?.map((item, i) => {
            return (
                <div key={i} className='postFeed--container'>
                    <div className='postFeed--user--container'>
                        <div className='postFeed--userIconName'>
                            <img className="postFeed--user--avatar" src={item.user_profile_image} />
                            <h3 onClick={() => handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                        </div>
                        {following && !doesUserExist(following, item.user) ?
                            <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                                person_add
                            </span> :
                            <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                                person_remove
                            </span>}
                    </div>
                    <Link to={'post/' + item.id}>
                        <div className='postFeed--content'>
                            <h4 className='postFeed--post'>{item.post}</h4>
                            <div className='postFeed--media--container'>
                                {item.media && item.media.map((image, j) => {
                                    return (
                                        <div key={j}>
                                            <img className='postFeed--media' src={image} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Link>
                    <div className='postFeed--buttons'>
                        {item?.liked_by && doesUserExist(item.liked_by, user?.username) ?
                            <span onClick={() => handleLike(item.id)} className="material-icons postButton liked">
                                favorite{item.likes > 0 ? <span className='postFeed--likes liked'>{item.likes}</span> : null}</span> :
                            <span onClick={() => handleLike(item.id)} className="material-icons postButton">
                                favorite{item.likes > 0 ? <span className='postFeed--likes' >{item.likes}</span> : null}</span>}
                        <span onClick={() => handleReply(item.id)} className="material-icons postButton">
                            forum{item.replies > 0 ? <span className='postFeed--replies'>{item.replies}</span> : null}</span>
                    </div>
                </div>
            )
    })

    return(
        postElements
    )

}


export default postElements