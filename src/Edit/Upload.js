import { useAuthState } from 'react-firebase-hooks/auth';
import { Login } from './Login';
import { auth, storageRef } from '../utils/useFirebase';
import { FileUploader } from "react-drag-drop-files";
import { useState } from 'react';
import { uploadBytesResumable } from "firebase/storage";
import FrontUpload from './FrontUpload';
import TopUpload from './TopUpload';

export default function Upload() {
    const [user, error, loading] = useAuthState(auth);
    const [name, setName] = useState('');
    if (!user) return <Login />


    return (
        <div>
            <h1>Hi {user.displayName}</h1>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <FrontUpload name={name} />
            <TopUpload name={name} />
        </div>
    )
}


function FileInputSelect(props) {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);

    const handleChange = (file) => {
        setFile(file)
    };

    const upload = () => {
        const ref = storageRef(props.type);
        const uploadTask = uploadBytesResumable(ref, file);

        uploadTask.on('state_changed',
            snapshot => setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            (error) => {
            },
            () => {
                // Upload completed successfully, now we can get the download URL
            }
        );
    }

    return (
        <div>
            <div> upload {props.type} video</div>
            {!progress && <FileUploader handleChange={handleChange} name="file" />}
            {progress && <div>{progress}%</div>}
            {file && <button onClick={upload}>Upload</button>}
        </div>

    )
}

export function UploadFile(props){
    const [progress, setProgress] = useState(null);

    const upload = () => {
        const ref = storageRef(props.name);
        const uploadTask = uploadBytesResumable(ref, props.file);

        uploadTask.on('state_changed',
            snapshot => setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            (error) => {
            },
            () => {
                // Upload completed successfully, now we can get the download URL
            }
        );
    }

    return (
        <div>
            {progress && <div>{progress}%</div>}
            <button onClick={upload}>Upload {props.name}</button>
        </div>

    )
}