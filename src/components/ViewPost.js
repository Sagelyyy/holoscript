import { useParams } from "react-router-dom"

const ViewPost = () => {
    const {id} = useParams()
    console.log(id)

    return (
        <div>
          <h3>ID: {id}</h3>
        </div>
    )
}

export default ViewPost