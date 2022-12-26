import { getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataContainer, getPath } from "../../Edit/Data";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";

export default function Pose(props){
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [data, setData] = useState(null);

    useEffect(()=>{
        getDownloadURL(storageRef(`${performance.name}-pose`)).then((url) => {
            fetch(url).then((res) => res.json()).then((data) => {
                setData(new DataContainer(data));
            })
        })
    }, [performance])

    if (!data) return <div>...</div>
    
    return <PoseVis data={data.setTime(layersData.time).get()} height={window.innerHeight * .5} />
}





export function PoseVis(props) {
    if (!props.data) return null;

    let paths = getBodyPaths(props.data, props.height);

    let extra = null
    if (props.data.length == 37) {
        const max = Math.max(...props.data.slice(33).map(d => Math.abs(d)))
        if (max == props.data[33]) extra = props.data[12]
        if (max == props.data[34]) extra = props.data[11]
        if (max == props.data[35]) extra = props.data[23]
        if (max == props.data[36]) extra = props.data[24]
        if (extra) {
            extra = rescalePoint(extra, props.height)
            extra = <circle cx={extra.x} cy={extra.y} r={5} fill="red" />
        }
    }

    return (
        <svg width={`${props.height}px`} height={`${props.height}px`} viewBox={`0 0 ${props.height} ${props.height}`} >
            {paths.map((path, i) => (
                <polyline key={i} points={path} stroke="red" fill="none" />
            ))}
            {extra}
        </svg>
    )
}
function rescalePoint(point, height) {
    return {
        x: (point.x+.5) * height,
        y: point.y * height
    }
}
function getBodyPaths(data, height) {
    const newData = data.map(pos => rescalePoint(pos, height))
    return [
        getPath(newData, [11, 12, 23, 24, 11]),
        getPath(newData, [11, 13, 15, 17, 19, 15]),
        getPath(newData, [12, 14, 16, 18, 20, 16]),
        getPath(newData, [23, 25, 27, 29, 31, 27]),
        getPath(newData, [24, 26, 28, 30, 32, 28]),
    ]
}