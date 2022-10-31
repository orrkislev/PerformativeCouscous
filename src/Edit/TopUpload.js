import { Hands } from "@mediapipe/hands";
import { useRef, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { DataTimer } from "./FrontUpload";
import { UploadFile } from "./Upload";

export default function TopUpload(props) {

    const [file, setFile] = useState(null);
    const [handsData, setHandsData] = useState(null);
    const allHandsData = useRef([]);
    const vidRef = useRef(null);
    const [ready, setReady] = useState(false);


    const onResults = (results) => {
        const newHandsData = {}
        for (let i = 0; i < results.multiHandedness.length; i++) {
            if (results.multiHandedness[i].label === 'Left') newHandsData.left = results.multiHandLandmarks[i]
            if (results.multiHandedness[i].label === 'Right') newHandsData.right = results.multiHandLandmarks[i]
        }
        if (newHandsData.left || newHandsData.right) {
            setHandsData(newHandsData)
            allHandsData.current.push({ time: vidRef.current.currentTime, data: newHandsData });
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
        let handsDataGetter;

        const updateCanvas = async () => {
            if (!ready) {
                await hands.send({ image: video })
            } else {
                setHandsData(handsDataGetter.getDataforTime(video.currentTime));
            }

            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) {
                video.currentTime = 0;
                if (!ready) {
                    setReady(true);
                    hands.close();
                    handsDataGetter = new DataTimer(allHandsData.current);
                } else {
                    handsDataGetter.reset()
                }
            }
            video.requestVideoFrameCallback(updateCanvas);
        }
        video.requestVideoFrameCallback(updateCanvas);
    };

    return (
        <div>
            <video ref={vidRef} height='150px' />
            {!file && <FileUploader handleChange={selectFile} name="file" />}
            <HandsVis data={handsData} height={150} />

            {ready && (
                <div>
                    <UploadFile name={`${props.name}-top`} file={file} />
                    <UploadFile name={`${props.name}-gesture`}
                        file={new Blob([JSON.stringify(allHandsData.current)], { type: "application/json" })} />
                </div>
            )}
        </div>
    )
}







export function HandsVis(props) {
    if (!props.data) return null;

    const paths = []
    if (props.data.left) paths.push(...getHandPaths(props.data.left, props.height))
    if (props.data.right) paths.push(...getHandPaths(props.data.right, props.height))

    return (
        <svg width={`${props.height * 2}px`} height={`${props.height}px`} viewBox={`0 0 ${props.height * 2} ${props.height}`} >
            {paths.map((path, i) => (
                <polyline key={i} points={path} stroke="white" />
            ))}
        </svg>
    )
}

function getHandPaths(data, height) {
    const newData = data.map(pos => {
        return {
            x: (pos.x + 1) * height,
            y: pos.y * height
        }
    })
    return [
        getPath(newData, [0, 1, 2, 3, 4]),
        getPath(newData, [0, 5, 9, 13, 17, 0]),
        getPath(newData, [5, 6, 7, 8]),
        getPath(newData, [9, 10, 11, 12]),
        getPath(newData, [13, 14, 15, 16]),
        getPath(newData, [17, 18, 19, 20]),
    ]
}


export function getPath(drawPos, positions) {
    return positions.map(i => `${drawPos[i].x},${drawPos[i].y}`).join(' ')
}