import { Holistic } from "@mediapipe/holistic";
import { useRef, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { UploadFile } from "./file";
import { DataContainer } from "./Data";
import { RhythmVis } from "../conponents/layers/Rhythm";

export default function BackUpload(props) {
    const [file, setFile] = useState(null);
    const vidRef = useRef(null);
    const [ready, setReady] = useState(false);

    const allRhythmData = useRef(new DataContainer());
    const opFlow = useRef(null);
    const [rhythmData, setRhythmData] = useState(null);

    const onPoseResult = (results) => {

        let rhythmVals = null
        if (results.poseLandmarks && opFlow.current) {
            const hip_right = results.poseLandmarks[23]
            const hip_left = results.poseLandmarks[24]
            rhythmVals = {
                valRight: opFlow.current.getFlow(hip_right.x, hip_right.y, 0.1),
                valLeft: opFlow.current.getFlow(hip_left.x, hip_left.y, 0.1),
                posRight: hip_right, posLeft: hip_left
            }
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
        opFlow.current = new OpticalFlow(video);

        const nextFrameCalc = async () => {
            opFlow.current.update()
            await pose.send({ image: video })


            video.currentTime += 1 / 20;
            if (video.currentTime >= video.duration) {
                video.currentTime = 0;
                setReady(true);
                pose.close();
                allRhythmData.current.fillGaps();
                allRhythmData.current.resizer('valRight', 0, 1)
                allRhythmData.current.resizer('valLeft', 0, 1)
                allRhythmData.current.lowPassFilter(.2)
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







// Optical flow Class
// it recieves a video element as input, and calculates the optical flow of the video on a 'update' call
// the 'get' function returns the optical flow of the last frame around a given point in a certain radius

class FlowZone {
    constructor(x, y, u, v) {
        this.x = x; this.y = y; this.u = u; this.v = v;
    }
}

class FlowCalculator {
    constructor(step = 8) {
        this.step = step;
        this.flow = {}
    }

    calculate(oldPixels, newPixels, width, height) {
        var zones = [];
        var step = this.step;
        var winStep = step * 2 + 1;

        var A2, A1B2, B1, C1, C2;
        var u, v, uu, vv;
        uu = vv = 0;
        var wMax = width - step - 1;
        var hMax = height - step - 1;
        var globalY, globalX, localY, localX;

        for (globalY = step + 1; globalY < hMax; globalY += winStep) {
            for (globalX = step + 1; globalX < wMax; globalX += winStep) {
                A2 = A1B2 = B1 = C1 = C2 = 0;

                for (localY = -step; localY <= step; localY++) {
                    for (localX = -step; localX <= step; localX++) {
                        var address = (globalY + localY) * width + globalX + localX;

                        var gradX = (newPixels[(address - 1) * 4]) - (newPixels[(address + 1) * 4]);
                        var gradY = (newPixels[(address - width) * 4]) - (newPixels[(address + width) * 4]);
                        var gradT = (oldPixels[address * 4]) - (newPixels[address * 4]);

                        A2 += gradX * gradX;
                        A1B2 += gradX * gradY;
                        B1 += gradY * gradY;
                        C2 += gradX * gradT;
                        C1 += gradY * gradT;
                    }
                }

                var delta = (A1B2 * A1B2 - A2 * B1);

                if (delta !== 0) {
                    /* system is not singular - solving by Kramer method */
                    var Idelta = step / delta;
                    var deltaX = -(C1 * A1B2 - C2 * B1);
                    var deltaY = -(A1B2 * C2 - A2 * C1);

                    u = deltaX * Idelta;
                    v = deltaY * Idelta;
                } else {
                    /* singular system - find optical flow in gradient direction */
                    var norm = (A1B2 + A2) * (A1B2 + A2) + (B1 + A1B2) * (B1 + A1B2);
                    if (norm !== 0) {
                        var IGradNorm = step / norm;
                        var temp = -(C1 + C2) * IGradNorm;

                        u = (A1B2 + A2) * temp;
                        v = (B1 + A1B2) * temp;
                    } else {
                        u = v = 0;
                    }
                }

                if (-winStep < u && u < winStep &&
                    -winStep < v && v < winStep) {
                    uu += u;
                    vv += v;
                    zones.push(new FlowZone(globalX, globalY, u, v));
                }
            }
        }

        this.flow = {
            zones: zones,
            u: uu / zones.length,
            v: vv / zones.length
        };

        return this.flow;
    };
};

class OpticalFlow {
    constructor(video, step = 8) {
        this.video = video;
        this.step = step;
        this.canvas = document.createElement('canvas');
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
        this.ctx = this.canvas.getContext('2d');
        this.flowCalculator = new FlowCalculator(step);
        this.oldPixels = null;
        this.newPixels = null;
    }

    update() {
        if (this.canvas.width < this.video.videoWidth || this.canvas.height < this.video.videoHeight) {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
        }
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        this.newPixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        if (this.oldPixels) {
            this.flowCalculator.calculate(this.oldPixels, this.newPixels, this.canvas.width, this.canvas.height);
        }
        this.oldPixels = this.newPixels;
    }

    getFlow(x, y, radius) {
        x = x * this.canvas.width;
        y = y * this.canvas.height;
        radius = radius * this.canvas.width;
        if (!this.oldPixels || !this.newPixels) return null;
        var zones = this.flowCalculator.flow.zones ?? []
        var u = 0, v = 0, count = 0;
        for (var i = 0; i < zones.length; i++) {
            if (Math.abs(zones[i].x - x) < radius && Math.abs(zones[i].y - y) < radius) {
                u += zones[i].u;
                v += zones[i].v;
                count++;
            }
        }
        u /= count;
        v /= count;
        return Math.abs(u) + Math.abs(v);
    }
}