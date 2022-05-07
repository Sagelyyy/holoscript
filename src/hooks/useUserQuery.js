import { useState, useEffect } from "react";
import { getFirestore, getDocs, collection, doc, setDoc, addDoc, getDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

const useUserQuery = (user) => {

    const [userData, setUserData] = useState(null)

    const getUser = async () => {
        const docRef = doc(db, "users", user);
        const docSnap = await getDoc(docRef);
        let userInfo = {}
        
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          userInfo = {...docSnap.data()}
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }

        setUserData(userInfo)
    }

    useEffect(() => {
        getUser()
    },[query])

    return [userData]
}

export default useUserQuery