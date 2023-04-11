import { Holistic } from "@mediapipe/holistic";
import { useRef, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import * as faceapi from 'face-api.js';
import { UploadFile } from "./file";
import { DataContainer, getPath } from "./Data";
import { PoseVis } from "../conponents/layers/Pose";
import { MindVis } from "../conponents/layers/StateOfMind";

export default function FrontUpload(props) {
    const [file, setFile] = useState(null);
    const vidRef = useRef(null);
    const [ready, setReady] = useState(false);

    const allPoseData = useRef(new DataContainer());
    const allExpressionData = useRef(new DataContainer());
    const allFaceData = useRef(new DataContainer());

    const [poseData, setPoseData] = useState(null);
    const [expressionData, setExpressionData] = useState(null);

    const onPoseResult = (results) => {
        let positions = null
        if (results.poseLandmarks) {
            const headPos = results.poseLandmarks[0];
            const shoulder1 = results.poseLandmarks[12];
            const shoulder2 = results.poseLandmarks[11];
            const top = headPos.y - (shoulder1.y - headPos.y);
            const left = Math.min(shoulder1.x, shoulder2.x);
            const width = Math.abs(shoulder1.x - shoulder2.x);
            const height = Math.abs(shoulder1.y - top);
            allFaceData.current.insert({ top, left, width, height }, vidRef.current.currentTime);

            positions = results.poseLandmarks.map(landmark => {
                return { x: landmark.x * vidRef.current.videoWidth, y: landmark.y * vidRef.current.videoHeight }
            })
            const bottom = positions.reduce((a, b) => a.y < b.y ? a : b).y;
            positions.forEach(pos => pos.y -= bottom);
            const center = [23, 24, 12, 11].reduce((a, b) => a + positions[b].x, 0) / 4;
            positions.forEach(pos => pos.x -= center);
            const scale = 1 / positions.reduce((a, b) => a.y > b.y ? a : b).y;
            positions.forEach(pos => {
                pos.x *= scale;
                pos.y *= scale;
            });
        }
        allPoseData.current.insert(positions, vidRef.current.currentTime);
        setPoseData(positions)
    };

    const selectFile = (videoFile) => {
        props.updateFile(URL.createObjectURL(videoFile));
        setFile(videoFile)
        const video = vidRef.current;
        video.src = URL.createObjectURL(videoFile);

        const holi = new Holistic({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}` });
        const faceExpression = new FaceExpressions()
        holi.onResults(onPoseResult);

        const nextFrameCalc = async () => {
            await holi.send({ image: video })
            const newExpressions = await faceExpression.predict(video)
            allExpressionData.current.insert(newExpressions, vidRef.current.currentTime);
            setExpressionData(newExpressions)

            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) {
                video.currentTime = 0;
                setReady(true);
                holi.close();
                allPoseData.current.fillGaps();
                Pose_calcStuff(allPoseData.current)
                allExpressionData.current.fillGaps();
                allFaceData.current.fillGaps();
                video.requestVideoFrameCallback(nextFrameDisplay);
            } else video.requestVideoFrameCallback(nextFrameCalc);
        }

        const nextFrameDisplay = () => {
            allPoseData.current.setTime(vidRef.current?.currentTime)
            allExpressionData.current.setTime(vidRef.current?.currentTime)
            setPoseData(allPoseData.current.get())
            setExpressionData(allExpressionData.current.get())

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
                {!file && <FileUploader handleChange={selectFile} name="file" label="סרטון מהמצלמה מקדימה" />}
                <PoseVis data={poseData} width={150} height={150} />
                {expressionData && <MindVis focus={expressionData[0].focus} height={150} />}
            </div>

            {ready && (
                <div>
                    <UploadFile name={`${props.name}-front`}
                        file={file} />
                    <UploadFile name={`${props.name}-pose`}
                        file={new Blob([JSON.stringify(allPoseData.current.data)], { type: "application/json" })} />
                    <UploadFile name={`${props.name}-expression`}
                        file={new Blob([JSON.stringify(allExpressionData.current.data)], { type: "application/json" })} />
                    <UploadFile name={`${props.name}-portrait`}
                        file={new Blob([JSON.stringify(allFaceData.current.data)], { type: "application/json" })} />
                </div>
            )}
        </div>
    )
}






function Pose_calcStuff(poseData) {
    const poseStuffData = new DataContainer();
    for (let i = 1; i < poseData.data.length; i++) {
        const d1 = poseData.data[i - 1].data
        const d2 = poseData.data[i].data
        if (!d1 || !d2) {
            poseStuffData.insert(null, i)
        } else {
            const arm1Movemenet = dist(d1[12], d1[14]) - dist(d2[12], d2[14]) + dist(d1[14], d1[16]) - dist(d2[14], d2[16])
            const arm2Movemenet = dist(d1[11], d1[13]) - dist(d2[11], d2[13]) + dist(d1[13], d1[15]) - dist(d2[13], d2[15])
            const leg1Movemenet = dist(d1[23], d1[25]) - dist(d2[23], d2[25]) + dist(d1[25], d1[27]) - dist(d2[25], d2[27])
            const leg2Movemenet = dist(d1[24], d1[26]) - dist(d2[24], d2[26]) + dist(d1[26], d1[28]) - dist(d2[26], d2[28])
            poseStuffData.insert([arm1Movemenet, arm2Movemenet, leg1Movemenet, leg2Movemenet], i)
        }
    }
    poseStuffData.fillGaps()
    poseStuffData.lowPassFilter()
    for (let i = 0; i < poseStuffData.data.length; i++) {
        if (poseStuffData.data[i].data) poseData.data[i].data.push(...poseStuffData.data[i].data)
    }
}
function dist(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}







// ['angry', 'disgusted', 'fearful', 'happy', 'sad', 'surprised', 'neutral']
class FaceExpressions {
    constructor() {
        faceapi.loadSsdMobilenetv1Model('/models')
        faceapi.loadFaceExpressionModel('/models')
    }
    async predict(video) {
        if (video.readyState <= 2) return;
        const detections = await faceapi.detectSingleFace(video).withFaceExpressions()
        if (detections?.expressions) {
            detections.expressions.focus = detections.expressions.sad + detections.expressions.neutral
            detections.expressions.satisfaction = detections.expressions.happy + detections.expressions.surprised
            return [{ ...detections.expressions }];
        }
        return null
    }
}