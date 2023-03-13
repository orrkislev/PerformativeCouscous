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

    return (
        <>
            <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} ref={vidRef} >
                <source src={src} type="video/mp4" />
            </video>
            <RhythmVis data={data.setTime(layersData.time).get()} height={window.innerHeight * .5} />
        </>
    )
}

export function RhythmVis(props) {
    if (!props.data) return null;

    const pos = props.data.val < 0 ? props.data.posRight : props.data.posLeft
    pos.x *= props.height
    pos.y *= props.height
    const r = Math.abs(props.data.val) * 300

    return (
        <svg width={`${props.height}px`} height={`${props.height}px`} viewBox={`0 0 ${props.height} ${props.height}`} >
            <circle cx={pos.x} cy={pos.y} r={r} fill="blue" />
        </svg>
    )
}