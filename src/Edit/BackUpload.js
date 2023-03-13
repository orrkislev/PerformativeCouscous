import { Holistic } from "@mediapipe/holistic";
import { useRef, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import * as faceapi from 'face-api.js';
import { UploadFile } from "./file";
import { DataContainer, getPath } from "./Data";
import { PoseVis } from "../conponents/layers/Pose";
import { MindVis } from "../conponents/layers/StateOfMind";
import { Pose } from "@mediapipe/pose";
import { RhythmVis } from "../conponents/layers/Rhythm";

export default function BackUpload(props) {
    const [file, setFile] = useState(null);
    const vidRef = useRef(null);
    const [ready, setReady] = useState(false);

    const allRhythmData = useRef(new DataContainer());
    const [rhythmData, setRhythmData] = useState(null);

    const onPoseResult = (results) => {
        let rhythmVals = null
        if (results.poseLandmarks) {
            const hip_right = results.poseLandmarks[23]
            const hip_left = results.poseLandmarks[24]
            const shoulder_right = results.poseLandmarks[12]
            const shoulder_left = results.poseLandmarks[11]
            const knee_right = results.poseLandmarks[25]
            const knee_left = results.poseLandmarks[26]

            // const kneeMiddle = (knee_right.x + knee_left.x) / 2
            // const hipMiddle = (hip_right.x + hip_left.x) / 2
            // const shoulderMiddle = (shoulder_right.x + shoulder_left.x) / 2

            // const shoulderOffset = shoulderMiddle - hipMiddle
            // const kneeOffset = kneeMiddle - hipMiddle

            // val = shoulderOffset + kneeOffset

            const val = shoulder_right.x - hip_right.x + shoulder_left.x - hip_left.x + knee_right.x - hip_right.x + knee_left.x - hip_left.x
            rhythmVals = { val, posRight: hip_right, posLeft: hip_left }
        }
        allRhythmData.current.insert(rhythmVals, vidRef.current.currentTime);
        setRhythmData(rhythmVals)
    };

    const selectFile = (videoFile) => {
        setFile(videoFile)
        const video = vidRef.current;
        video.src = URL.createObjectURL(videoFile);


        const pose = new Holistic({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}` });
        pose.onResults(onPoseResult);

        const nextFrameCalc = async () => {
            await pose.send({ image: video })

            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) {
                video.currentTime = 0;
                setReady(true);
                pose.close();
                allRhythmData.current.fillGaps();
                video.requestVideoFrameCallback(nextFrameDisplay);
            } else video.requestVideoFrameCallback(nextFrameCalc);
        }

        const nextFrameDisplay = () => {
            allRhythmData.current.setTime(vidRef.current?.currentTime)
            setRhythmData(allRhythmData.current.get())

            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) {
                video.currentTime = 0;
            }
            video.requestVideoFrameCallback(nextFrameDisplay);
        }

        video.requestVideoFrameCallback(nextFrameCalc);
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <video ref={vidRef} height={file ? '150px' : '0px'} />
                {!file && <FileUploader handleChange={selectFile} name="file" label="סרטון מהמצלמה מאחורה" />}
                <RhythmVis data={rhythmData} height={150} />
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