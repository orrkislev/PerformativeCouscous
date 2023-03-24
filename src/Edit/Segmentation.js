import { useEffect, useRef, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { UploadFile } from "./file";
import { DataContainer } from "./Data";
import * as tf from '@tensorflow/tfjs';


export default function Segmentation(props) {
    const [file, setFile] = useState(null);
    const vidRef = useRef(null);
    const [ready, setReady] = useState(false);

    const model = useRef(null);

    useEffect( ()=>{
        tf.loadLayersModel('/weights/model.json').then((m) => {
            model.current = m;
            console.log('model loaded')
        });
    },[])

    const allPoseData = useRef(new DataContainer());
    const allExpressionData = useRef(new DataContainer());

    function process_input(video) {
        const img = tf.browser.fromPixels(video).toFloat();
        const scale = tf.scalar(255.);
        const mean = tf.tensor3d([0.485, 0.456, 0.406], [1, 1, 3]);
        const std = tf.tensor3d([0.229, 0.224, 0.225], [1, 1, 3]);
        const normalised = img.div(scale).sub(mean).div(std);
        const batched = normalised.transpose([2, 0, 1]).expandDims();
        return batched;
    }

    const selectFile = videoFile => {
        props.updateFile(URL.createObjectURL(videoFile));
        setFile(videoFile)
        const video = vidRef.current;
        video.src = URL.createObjectURL(videoFile);

        const nextFrameCalc = async () => {
            tf.engine().startScope();
            console.log('start scope')
            const frame = process_input(video);
            console.log('process input', frame)
            const predictions = model.current.predict(frame);
            console.log(predictions)
            // this.renderPredictions(predictions);
            tf.engine().endScope();

            // await holi.send({ image: video })
            // allExpressionData.current.insert(newExpressions, vidRef.current.currentTime)

            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) {
                video.currentTime = 0;
                setReady(true);
                // allPoseData.current.fillGaps();
                video.requestVideoFrameCallback(nextFrameDisplay);
            } else video.requestVideoFrameCallback(nextFrameCalc);
        }

        const nextFrameDisplay = () => {
            // allPoseData.current.setTime(vidRef.current?.currentTime)
            // setPoseData(allPoseData.current.get())

            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) video.currentTime = 0;
            video.requestVideoFrameCallback(nextFrameDisplay);
        }

        video.requestVideoFrameCallback(nextFrameCalc);
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <video ref={vidRef} height={file ? '150px' : '0px'} />
                {!file && <FileUploader handleChange={selectFile} name="file" label="segmentation" />}
            </div>

            {ready && (
                <div>
                    <UploadFile name={`${props.name}-front`}
                        file={file} />
                    {/* <UploadFile name={`${props.name}-pose`} */}
                        // file={new Blob([JSON.stringify(allPoseData.current.data)], { type: "application/json" })} />
                </div>
            )}
        </div>
    )
}