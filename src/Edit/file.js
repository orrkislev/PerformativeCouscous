import { uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { storageRef } from "../utils/useFirebase";

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