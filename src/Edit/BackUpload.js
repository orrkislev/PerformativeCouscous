import { Holistic } from "@mediapipe/holistic";
import { useRef, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { UploadFile } from "./file";
import { DataContainer } from "./Data";
import { RhythmVis } from "../conponents/layers/Rhythm";
import usePosenet from "../utils/usePosenet";

export default function BackUpload(props) {
    const [file, setFile] = useState(null);
    const vidRef = useRef(null);
    const fullVidRef = useRef(null);
    const [ready, setReady] = useState(false);
    const posenet = usePosenet()

    const lastPos = useRef(null)
    const allRhythmData = useRef(new DataContainer());
    const opFlow = useRef(null);
    const [rhythmData, setRhythmData] = useState(null);

    const selectFile = (videoFile) => {
        setFile(videoFile)
        const smallVid = vidRef.current;
        const fullVid = fullVidRef.current;
        fullVid.src = URL.createObjectURL(videoFile);
        smallVid.src = URL.createObjectURL(videoFile);
        smallVid.onloadedmetadata = processVideo;
    };

    const processVideo = () => {
        const smallVid = vidRef.current;
        const fullVid = fullVidRef.current;
        fullVid.width = fullVid.videoWidth;
        fullVid.height = fullVid.videoHeight;

        const nextFrameCalc = async () => {
            await posenet.detect(fullVid)

            let newVals = null
            const posRight = posenet.getPart('right_hip', true)
            const posLeft = posenet.getPart('left_hip', true)
            if (posRight && posLeft) {
                const valRight = Math.min(posenet.getMovement('right_hip'), 30)
                const valLeft = Math.min(posenet.getMovement('left_hip'), 30)
                newVals = { valLeft, valRight, posRight, posLeft }
                setRhythmData({ valLeft, valRight, posRight, posLeft })
            }
            allRhythmData.current.insert(newVals, fullVid.currentTime);

            smallVid.currentTime += 1 / 20;
            fullVid.currentTime = smallVid.currentTime;
            if (smallVid.currentTime >= smallVid.duration) {
                smallVid.currentTime = 0;
                setReady(true);
                allRhythmData.current.fillGaps();
                allRhythmData.current.resizer('valRight', 5, 40)
                allRhythmData.current.resizer('valLeft', 5, 40)
                smallVid.requestVideoFrameCallback(nextFrameDisplay);
            } else smallVid.requestVideoFrameCallback(nextFrameCalc);
        }

        const nextFrameDisplay = () => {
            allRhythmData.current.setTime(vidRef.current?.currentTime)
            setRhythmData(allRhythmData.current.get())

            smallVid.currentTime += 1 / 20;
            if (smallVid.currentTime >= smallVid.duration) {
                smallVid.currentTime = 0;
            }
            smallVid.requestVideoFrameCallback(nextFrameDisplay);
        }
        smallVid.requestVideoFrameCallback(nextFrameCalc);

    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <video ref={vidRef} height={file ? '150px' : '0px'} />
                <video ref={fullVidRef} hidden />
                {!file && <FileUploader handleChange={selectFile} name="file" label="סרטון מהמצלמה מאחורה" />}
                <RhythmVis data={rhythmData} height={150} width={150 * 16 / 9} />

            </div>

            {ready && (
                <div>
                    <UploadFile name={`${props.name}-back`} file={file} />
                    <UploadFile name={`${props.name}-rhythm`}
                        file={new Blob([JSON.stringify(allRhythmData.current.data)], { type: "application/json" })} />
                </div>
            )}
        </div>
    )
}