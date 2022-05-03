import { useState, useEffect } from "react";
import { getFirestore, getDocs, collection, doc, setDoc, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

const useUserData = (uid) => {

    // "id": null,
	// "id_str": "",
	// "name": "",
	// "screen_name": "",
	// "location": "",
	// "description": "",
	// "url": "",
    // "followers_count": null,
	// "friends_count": null,
	// "listed_count": null,
	// "created_at": "",
    // "profile_image": ""

    const [userData, setUserData] = useState({})

    const getData = async () => {
        let user = []
        const querySnapshot = await getDocs(collection(db, 'users'))
        querySnapshot.forEach((doc) => {
            user.push(doc.data())
          });
        return user
    }

    useEffect(() => {
        setUserData(getData())
    },[])

    return userData
}

export default useUserData