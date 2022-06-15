import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase"

export const doesUserExist = (arr, user) => {
    return arr.some(arrVal => user.toLowerCase() === arrVal)
}

export const getFollowing = async (user) => {
    const docRef = doc(db, "users", user.uid)

    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
        const following = [...docSnap.data().following]
        return following
    }
}


