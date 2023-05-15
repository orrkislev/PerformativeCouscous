import { useRef, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import * as faceapi from '@vladmandic/face-api';
import { UploadFile } from "./file";
import { DataContainer } from "./Data";
import { PoseVis } from "../conponents/layers/Pose";
import { MindVis } from "../conponents/layers/StateOfMind";
import usePosenet from "../utils/usePosenet";

export default function FrontUpload(props) {
    const [file, setFile] = useState(null);
    const vidRef = useRef(null);
    const fullVidRef = useRef(null);
    const [ready, setReady] = useState(false);
    const posenet = usePosenet('BlazePose')

    const allPoseData = useRef(new DataContainer());
    const allExpressionData = useRef(new DataContainer());
    const allFaceData = useRef(new DataContainer());

    const [poseData, setPoseData] = useState(null);
    const [expressionData, setExpressionData] = useState(null);

    const selectFile = (videoFile) => {
        props.updateFile(URL.createObjectURL(videoFile));
        setFile(videoFile)
        fullVidRef.current.src = URL.createObjectURL(videoFile);
        vidRef.current.src = URL.createObjectURL(videoFile);
        vidRef.current.onloadedmetadata = processVideo
    }

    const processVideo = () => {
        const smallVid = vidRef.current;
        const fullVid = fullVidRef.current;
        fullVid.width = fullVid.videoWidth;
        fullVid.height = fullVid.videoHeight;

        const faceExpression = new FaceExpressions()

        const nextFrameCalc = async () => {
            const newPose = await posenet.detect(fullVid)

            let vals = null
            if (newPose) {
                const positions = posenet.getAll_xy()
                const bottom = positions.reduce((a, b) => a.y < b.y ? a : b).y;
                positions.forEach(pos => pos.y -= bottom);

                const center = [11, 12, 23, 24].reduce((a, b) => a + positions[b].x, 0) / 4;
                positions.forEach(pos => pos.x -= center);
                const scale = 1 / positions.reduce((a, b) => a.y > b.y ? a : b).y;
                positions.forEach(pos => {
                    pos.x *= scale;
                    pos.y *= scale;
                });
                vals = { positions }

                const arm_left_1 = posenet.getMovement('left_wrist')
                const arm_left_2 = posenet.getMovement('left_elbow')
                const arm_left_3 = posenet.getMovement('left_shoulder')
                const arm_left = arm_left_1 + arm_left_2 + arm_left_3

                const arm_right_1 = posenet.getMovement('right_wrist')
                const arm_right_2 = posenet.getMovement('right_elbow')
                const arm_right_3 = posenet.getMovement('right_shoulder')
                const arm_right = arm_right_1 + arm_right_2 + arm_right_3

                const leg_left_1 = posenet.getMovement('left_hip')
                const leg_left_2 = posenet.getMovement('left_knee')
                const leg_left_3 = posenet.getMovement('left_ankle')
                const leg_left = leg_left_1 + leg_left_2 + leg_left_3

                const leg_right_1 = posenet.getMovement('right_hip')
                const leg_right_2 = posenet.getMovement('right_knee')
                const leg_right_3 = posenet.getMovement('right_ankle')
                const leg_right = leg_right_1 + leg_right_2 + leg_right_3
                vals.intensity = { arm_left, arm_right, leg_left, leg_right }
            }
            allPoseData.current.insert(vals, smallVid.currentTime);
            setPoseData(vals)

            if (newPose) {
                const headPos = posenet.getPart('nose')
                const shoulder1 = posenet.getPart('left_shoulder')
                const shoulder2 = posenet.getPart('right_shoulder')
                const top = headPos.y - (shoulder1.y - headPos.y);
                const left = Math.min(shoulder1.x, shoulder2.x);
                const width = Math.abs(shoulder1.x - shoulder2.x);
                const height = Math.abs(shoulder1.y - top);
                allFaceData.current.insert({ top, left, width, height }, smallVid.currentTime);
            }

            const newExpressions = await faceExpression.predict(fullVid)
            allExpressionData.current.insert(newExpressions, vidRef.current.currentTime);
            setExpressionData(newExpressions)

            smallVid.currentTime += 1 / 20;
            fullVid.currentTime = smallVid.currentTime;
            if (smallVid.currentTime >= smallVid.duration) {
                smallVid.currentTime = 0;
                setReady(true);
                allPoseData.current.fillGaps();
                allExpressionData.current.fillGaps();
                allFaceData.current.fillGaps();
                smallVid.requestVideoFrameCallback(nextFrameDisplay);
            } else smallVid.requestVideoFrameCallback(nextFrameCalc);
        }

        const nextFrameDisplay = () => {
            allPoseData.current.setTime(smallVid.currentTime)
            allExpressionData.current.setTime(smallVid.currentTime)
            setPoseData(allPoseData.current.get())
            setExpressionData(allExpressionData.current.get())

            smallVid.currentTime += 1 / 20;
            if (smallVid.currentTime >= smallVid.duration) {
                smallVid.currentTime = 0;
            }
            smallVid.requestVideoFrameCallback(nextFrameDisplay);
        }
        smallVid.requestVideoFrameCallback(nextFrameCalc)
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <video ref={vidRef} height={file ? '150px' : '0px'} />
                <video ref={fullVidRef} hidden />
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






// ['angry', 'disgusted', 'fearful', 'happy', 'sad', 'surprised', 'neutral']
class FaceExpressions {
    constructor() {        
        this.initialized = false
    }
    async init(){
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        await faceapi.nets.faceExpressionNet.loadFromUri('/models')
        this.initialized = true
    }
    async predict(video) {
        if (!this.initialized) await this.init()
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