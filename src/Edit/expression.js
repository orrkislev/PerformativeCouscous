import * as faceapi from 'face-api.js';
import { useEffect, useState } from 'react';

export default function FaceExpression(props) {
    const [expressions, setExpressions] = useState([]);

    useEffect(() => {
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    }, []);

    useEffect(() => {
        // canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        // const displaySize = {
        //     width: videoWidth,
        //     height: videoHeight
        // }

        // faceapi.matchDimensions(canvasRef.current, displaySize);

        async function predict() {
            const detections = await faceapi.detectAllFaces(props.video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
            console.log(detections);
        }
        predict()

        // const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        // canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        // canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        // canvasRef && canvasRef.current && faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
    }, [props.update])

    return (
        <div>
            {expressions.map((expression, i) => {
                return (
                    <div key={i}>
                        <p>{expression.expression}: {expression.probability}</p>
                    </div>
                )
            })}
        </div>
    );
}