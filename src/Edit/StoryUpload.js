import { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { UploadFile } from "./file";

export default function StoryUpload(props) {
    const [file, setFile] = useState(null);
    const [ready, setReady] = useState(false);

    const selectFile = (videoFile) => {
        setFile(videoFile)
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                {!file && <FileUploader handleChange={selectFile} name="file" label="קובץ שמע" />}
                {file && <UploadFile name={`${props.name}-story`} file={file} />}
            </div>
        </div>
    )
}
