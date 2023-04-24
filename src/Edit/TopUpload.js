import { Hands } from "@mediapipe/hands";
import { useRef, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { HandsVis } from "../conponents/layers/Gesture";
import { DataContainer, getPath } from "./Data";
import { UploadFile } from "./file";

export default function TopUpload(props) {
    const [file, setFile] = useState(null);
    const vidRef = useRef(null);
    const [ready, setReady] = useState(false);

    const [handsData, setHandsData] = useState(null);
    const allHandsData = useRef(new DataContainer());

    const onResults = (results) => {
        const newHandsData = {}
        for (let i = 0; i < results.multiHandedness.length; i++) {
            if (results.multiHandedness[i].label === 'Left') newHandsData.left = results.multiHandLandmarks[i]
            if (results.multiHandedness[i].label === 'Right') newHandsData.right = results.multiHandLandmarks[i]
        }
        if (newHandsData.left || newHandsData.right) {
            allHandsData.current.insert(newHandsData, vidRef.current.currentTime);
            setHandsData(newHandsData)
        } else {
            allHandsData.current.insert(null, vidRef.current.currentTime);
            setHandsData(null)
        }
    };

    const selectFile = (videoFile) => {
        setFile(videoFile)
        const video = vidRef.current;
        video.src = URL.createObjectURL(videoFile);

        const hands = new Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);

        const nextFrameCalc = async () => {
            await hands.send({ image: video })

            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) {
                video.currentTime = 0;
                setReady(true);
                hands.close();
                allHandsData.current.fillGaps();
                video.requestVideoFrameCallback(nextFrameDisplay);
            } else video.requestVideoFrameCallback(nextFrameCalc);
        }

        const nextFrameDisplay = () => {
            allHandsData.current.setTime(vidRef.current.currentTime)
            setHandsData(allHandsData.current.get())
            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) {
                video.currentTime = 0;
            }
            video.requestVideoFrameCallback(nextFrameDisplay);
        }
        video.requestVideoFrameCallback(nextFrameCalc);
    };

    return (
        <div style={{ display: 'flex' }}>
            <video ref={vidRef} height={file ? '150px' : '0px'} />
            {!file && <FileUploader handleChange={selectFile} name="file" label="סרטון מהמצלמה מלמעלה" />}
            <HandsVis data={handsData} height={150} width={200} />

            {ready && (
                <div>
                    <UploadFile name={`${props.name}-top`} file={file} />
                    <UploadFile name={`${props.name}-gesture`}
                        file={new Blob([JSON.stringify(allHandsData.current.data)], { type: "application/json" })} />
                </div>
            )}
        </div>
    )
}