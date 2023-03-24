import { getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataContainer, getPath } from "../../Edit/Data";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";

export default function Gesture(props) {
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [data, setData] = useState(null);

    useEffect(() => {
        getDownloadURL(storageRef(`${performance.name}-gesture`)).then((url) => {
            fetch(url).then((res) => res.json()).then((data) => {
                setData(new DataContainer(data));
            })
        })
    }, [performance])

    if (!data) return <div>...</div>

    return <HandsVis data={data.setTime(layersData.time).get()} width={props.size.width ?? 200} height={props.size.height ?? 200}/>
}



export function HandsVis(props) {
    if (!props.data) return null;

    const paths = []
    if (props.data.left) paths.push(...getHandPaths(props.data.left, props.width, props.height))
    if (props.data.right) paths.push(...getHandPaths(props.data.right, props.width, props.height))

    return (
        <svg width={`${props.width}px`} height={`${props.height}px`} viewBox={`0 0 ${props.width} ${props.height}`} >
            {paths.map((path, i) => (
                <polyline key={i} points={path} stroke='#ff00ff' fill="#FF00FF88" strokeWidth={2} />
            ))}
        </svg>
    )
}


function getHandPaths(data, width, height) {
    const newData = data.map(pos => {
        return {
            x: pos.x * Math.min(width,height),
            y: pos.y * Math.min(width,height)
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