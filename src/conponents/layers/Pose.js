import { getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataContainer, getPath } from "../../Edit/Data";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";

export default function Pose(props) {
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [data, setData] = useState(null);

    useEffect(() => {
        getDownloadURL(storageRef(`${performance.name}-pose`)).then((url) => {
            fetch(url).then((res) => res.json()).then((data) => {
                const newData = new DataContainer(data)
                newData.lowPassFilterValue('intensity', .2)
                setData(newData);
            })
        })
    }, [performance])

    if (!data) return <div>...</div>

    return <PoseVis data={data.setTime(layersData.time).get()} width={props.size.width ?? 200} height={props.size.height ?? 200} />
}





export function PoseVis(props) {
    if (!props.data) return null;

    let positions = props.data.positions.map((pos, i) => rescalePoint(pos, props.height))
    const midWidth = positions.reduce((a, b) => a + b.x, 0) / positions.length
    positions.forEach(pos => pos.x -= midWidth - props.width / 2)

    let paths = getBodyPaths(positions);

    let extra = null
    if (props.data.intensity){
        const max = Object.entries(props.data.intensity).reduce((a, b) => a[1] > b[1] ? a : b)
        if (max[0] == 'arm_left') extra = positions[11]
        else if (max[0] == 'arm_right') extra = positions[12]
        else if (max[0] == 'leg_left') extra = positions[23]
        else if (max[0] == 'leg_right') extra = positions[24]
        if (extra) {
            const r = (props.height - 200) / 300 * 5 + 5
            extra = <circle cx={extra.x} cy={extra.y} r={r} fill="red" />
        }
    }

    return (
        <svg width={`${props.width}px`} height={`${props.height}px`} viewBox={`0 0 ${props.width} ${props.height}`} >
            {paths.map((path, i) => (
                <polyline key={i} points={path} stroke="red" fill="none" strokeWidth={2} />
            ))}
            {extra}
        </svg>
    )
}
function rescalePoint(point, height) {
    return {
        x: (point.x + .5) * height,
        y: point.y * height
    }
}
function getBodyPaths(data) {
    return [
        getPath(data, [11, 12, 23, 24, 11]),
        getPath(data, [11, 13, 15, 17, 19, 15]),
        getPath(data, [12, 14, 16, 18, 20, 16]),
        getPath(data, [23, 25, 27, 29, 31, 27]),
        getPath(data, [24, 26, 28, 30, 32, 28]),
    ]
}