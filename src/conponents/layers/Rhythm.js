import { getDownloadURL } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataContainer } from "../../Edit/Data";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";

export default function Rhythm(props) {
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [data, setData] = useState(null);
    const [src, setsrc] = useState(null);
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
        if (vidRef.current) {
            vidRef.current.currentTime = layersData.time;
        }
    }, [layersData.time])

    if (!data) return <div>...</div>

    const width = Math.round(window.innerHeight * .5)
    const height = width * 9 / 16

    return (
        <>
            <video style={{ width: width + "px", objectFit: 'cover', position:'absolute', zIndex:-1 }} ref={vidRef} >
                <source src={src} type="video/mp4" />
            </video>
            <RhythmVis data={data.setTime(layersData.time).get()} height={height} width={width} />
        </>
    )
}

export function RhythmVis(props) {
    if (!props.data) return null;

    const pos = props.data.val < 0 ? props.data.posLeft : props.data.posRight
    // console.log(props.data.posRight.y,props.data.posLeft.y)
    const x = pos.x *  props.height
    const y = pos.y *  props.height
    const r = Math.abs(props.data.val) * 100

    return (
        <svg width={`${props.width}px`} height={`${props.height}px`} viewBox={`0 0 ${props.height} ${props.height}`} >
            <circle cx={x} cy={y} r={r} fill="blue" />
            {/* <circle cx={50} cy={50} r={r} fill="blue" /> */}
        </svg>
    )
}