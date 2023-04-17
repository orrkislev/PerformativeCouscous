import { getDownloadURL } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataContainer } from "../../Edit/Data";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";
import { uiStateAtom } from "../UI";

export default function Rhythm(props) {
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [data, setData] = useState(null);
    const [src, setsrc] = useState(null);
    const uistate = useRecoilValue(uiStateAtom);
    const vidRef = useRef(null);


    useEffect(() => {
        getDownloadURL(storageRef(`${performance.name}-rhythm`)).then((url) => {
            fetch(url).then((res) => res.json()).then((data) => {
                setData(new DataContainer(data));
            })
        })
        getDownloadURL(storageRef(`${performance.name}-back`)).then((url) => {
            setsrc(url);
        })
    }, [performance])

    useEffect(() => {
        if (vidRef.current && layersData.time) {
            vidRef.current.currentTime = layersData.time;
        }
    }, [layersData.time])

    if (!data) return null

    const showVis = uistate.rhythm != null ? (uistate.rhythm == 1 || uistate.rhythm == 2) : true;
    const showVid = uistate.rhythm != null ? (uistate.rhythm == 1 || uistate.rhythm == 3) : true;

    return (
        <>
            {showVid &&
                <video style={{ width: props.size.width + "px", height: props.size.height + "px", objectFit: 'cover', position: 'absolute', zIndex: -1 }} ref={vidRef} >
                    <source src={src} type="video/mp4" />
                </video>
            }
            {showVis &&
                <RhythmVis data={data.setTime(layersData.time).get()} width={props.size.width} height={props.size.height} />
            }
        </>
    )
}

export function RhythmVis(props) {
    const sound = useRef(null)
    const lastVal = useRef(0);

    let r = 0
    let pos = { x: 0, y: 0 }
    // if (!props.data) return null;

    if (props.data) {
        const pos1 = imagePosInContainer(props.data.posLeft.x, props.data.posLeft.y, props.width, props.height, 1920, 1080)
        const pos2 = imagePosInContainer(props.data.posRight.x, props.data.posRight.y, props.width, props.height, 1920, 1080)
        const r1 = Math.abs(props.data.valLeft * 100)
        const r2 = Math.abs(props.data.valRight * 100)

        r = props.data.valLeft > props.data.valRight ? r1 : r2;
        pos = props.data.valLeft > props.data.valRight ? pos1 : pos2;

        if (lastVal.current % 4 > 3 && r % 4 < 1) {
            if (sound.current) sound.current.play()
        }
        lastVal.current = r;
    }

    return (
        <>
            <svg width={`${props.width}px`} height={`${props.height}px`} viewBox={`0 0 ${props.width} ${props.height}`} >
                <circle cx={pos.x} cy={pos.y} r={r} fill="blue" />
                {/* <circle cx={pos1.x} cy={pos1.y} r={r1} fill="blue" /> */}
                {/* <circle cx={pos2.x} cy={pos2.y} r={r2} fill="blue" /> */}
            </svg>
            <audio hidden src="shaker.wav" ref={sound} />
        </>
    )
}

export function imagePosInContainer(x, y, containerWidth, containerHeight, imageWidth, imageHeight) {
    const imageRatio = imageWidth / imageHeight;
    const containerRatio = containerWidth / containerHeight;
    let scale = 1
    if (imageRatio > containerRatio) {
        scale = containerHeight / imageHeight;
    } else {
        scale = containerWidth / imageWidth;
    }

    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;

    const scaledX = x * scaledWidth;
    const scaledY = y * scaledHeight;

    const offsetX = (scaledWidth - containerWidth) / 2;
    const offsetY = (scaledHeight - containerHeight) / 2;


    return {
        x: scaledX - offsetX,
        y: scaledY - offsetY,
    }
}