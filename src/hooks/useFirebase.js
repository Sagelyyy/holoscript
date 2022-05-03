import { useState, useEffect } from "react";
import { getFirestore, getDocs, collection, doc, setDoc, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

const useFirebase = (query) => {

    const [data, setData] = useState(null)

    const getData = async () => {
        let fbData = []
        const querySnapshot = await getDocs(collection(db, query))
        querySnapshot.forEach((doc) => {
            fbData.push(doc.data())
          });
        setData(fbData)
    }

    useEffect(() => {
        getData()
    },[query])

    return [data]
}

export default useFirebase