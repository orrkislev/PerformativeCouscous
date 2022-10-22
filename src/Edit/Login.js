import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/useFirebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const Login = () => {
    const [user, error, loading] = useAuthState(auth);

    if (!user){
        return (
            <div>
                <h1>Login</h1>
                <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>Sign in with Google</button>
            </div>
        )
    }

    return null
}