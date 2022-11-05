import { useAuthState } from 'react-firebase-hooks/auth';
import { Login } from './Login';
import { auth } from '../utils/useFirebase';
import { useState } from 'react';
import FrontUpload from './FrontUpload';
import TopUpload from './TopUpload';
import { TimeLineInput } from './TimeLine';

export default function Upload() {
    const [user, error, loading] = useAuthState(auth);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState(false);

    const updateDuration = (newDuration) => {
        if (!duration) setDuration(newDuration)
        else if (newDuration > duration) setDuration(newDuration)
    }


    if (!user) return <Login />


    return (
        <div>
            <h1>Hi {user.displayName}</h1>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <FrontUpload name={name} updateDuration={updateDuration}/>
            <TopUpload name={name} updateDuration={updateDuration}/>
            <TimeLineInput name={name} duration={duration} />
        </div>
    )
}