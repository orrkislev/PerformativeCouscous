import { Holistic } from "@mediapipe/holistic";
import { useRef, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import * as faceapi from 'face-api.js';
import { UploadFile } from "./Upload";
import { getPath } from "./TopUpload";

export default function FrontUpload(props) {

    const [file, setFile] = useState(null);
    const [poseData, setPoseData] = useState(null);
    const allData = useRef([]);
    const vidRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [expression, setExpression] = useState('');
    const allExpressionData = useRef([]);


    const onResults = (results) => {
        if (results.poseLandmarks) {
            const positions = results.poseLandmarks.map(landmark => {
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
            setPoseData(positions);
            allData.current.push({ time: vidRef.current.currentTime, data: positions });
        } else {
            allData.current.push({ time: vidRef.current.currentTime, data: null });
            setPoseData(null)
        }
    };

    const selectFile = (videoFile) => {
        setFile(videoFile)
        const video = vidRef.current;
        video.src = URL.createObjectURL(videoFile);

        const holi = new Holistic({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}` });
        const faceExpression = new FaceExpressions()

        holi.onResults(onResults);
        let poseDataGetter, expressionDataGetter;

        const updateCanvas = async () => {
            if (!ready) {
                await holi.send({ image: video })
                const expressions = await faceExpression.predict(video)
                if (expressions) {
                    setExpression(expressions)
                    allExpressionData.current.push({ time: video.currentTime, data: expressions })
                } else {
                    allExpressionData.current.push({ time: video.currentTime, data: null })
                }
            } else {
                setPoseData(poseDataGetter.getDataforTime(video.currentTime));
                setExpression(expressionDataGetter.getDataforTime(video.currentTime));
            }

            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) {
                video.currentTime = 0;
                if (!ready) {
                    setReady(true);
                    holi.close();
                    poseDataGetter = new DataTimer(allData.current);
                    expressionDataGetter = new DataTimer(allExpressionData.current);
                } else {
                    poseDataGetter.reset()
                    expressionDataGetter.reset()
                }
            }
            video.requestVideoFrameCallback(updateCanvas);
        }
        video.requestVideoFrameCallback(updateCanvas);
    };


    const strongestExpression = expression ? expression[Object.keys(expression).reduce((a, b) => expression[a].probability > expression[b].probability ? a : b)].expression : null

    return (
        <div>
            <video ref={vidRef} height='150px' />
            {!file && <FileUploader handleChange={selectFile} name="file" />}
            <PoseVis data={poseData} height={150} />
            {strongestExpression && <div>{strongestExpression}</div>}

            {ready && (
                <div>
                    <UploadFile name={`${props.name}-front`} 
                        file={file} />
                    <UploadFile name={`${props.name}-pose`}
                        file={new Blob([JSON.stringify(allData.current)], { type: "application/json" })} />
                    <UploadFile name={`${props.name}-expression`}
                        file={new Blob([JSON.stringify(allExpressionData.current)], { type: "application/json" })} />
                </div>
            )}
        </div>
    )
}









export function PoseVis(props) {
    if (!props.data) return null;

    let paths = getBodyPaths(props.data, props.height);

    return (
        <svg width={`${props.height * 2}px`} height={`${props.height}px`} viewBox={`0 0 ${props.height * 2} ${props.height}`} >
            {paths.map((path, i) => (
                <polyline key={i} points={path} stroke="white" fill="blue" />
            ))}
        </svg>
    )
}
function getBodyPaths(data, height) {
    const newData = data.map(pos => {
        return {
            x: (pos.x + 1) * height,
            y: pos.y * height
        }
    })
    return [
        getPath(newData, [11, 12, 23, 24, 11]),
        getPath(newData, [11, 13, 15, 17, 19, 15]),
        getPath(newData, [12, 14, 16, 18, 20, 16]),
        getPath(newData, [23, 25, 27, 29, 31, 27]),
        getPath(newData, [24, 26, 28, 30, 32, 28]),
    ]
}






export class DataTimer {
    constructor(data) {
        this.data = data;
        this.index = 1;
    }
    getDataforTime(time) {
        while (this.index < this.data.length && this.data[this.index].time < time) {
            this.index++;
        }
        if (this.index >= this.data.length) this.index = 1;
        return this.data[this.index - 1].data;
    }
    reset() {
        this.index = 1;
    }
}







class FaceExpressions {
    constructor() {
        faceapi.loadSsdMobilenetv1Model('/models')
        faceapi.loadFaceExpressionModel('/models')
    }
    async predict(video) {
        if (video.readyState <= 2) return;
        const detections = await faceapi.detectSingleFace(video).withFaceExpressions()
        if (detections) {
            return ['angry', 'disgusted', 'fearful', 'happy', 'sad', 'surprised', 'neutral'].map(exp => ({
                expression: exp,
                probability: detections.expressions[exp]
            }))
        }
        return null
    }
}