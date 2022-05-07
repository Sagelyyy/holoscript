import { useEffect, useState } from "react";
import { useUserAuth } from "../contexts/UserAuthContext"
import useFirebase from "../hooks/useFirebase";
import useUserQuery from "../hooks/useUserQuery";


const AccountTab = () => {
    const { authUser } = useUserAuth()
    const [user] = useUserQuery(authUser?.uid)
    const [showTab, setShowTab] = useState(false)


    console.log(user)
    console.log(authUser)


    useEffect(() => {
        if (authUser) {
            setShowTab(true)
        } else {
            setShowTab(false)
        }
    }, [authUser])

    if (showTab) {
        return (
            <div>
                <h1>
                    <p>Test</p>
                    {user ? user.username : null}
                </h1>
            </div>
        )
    }
}

export default AccountTab;