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

    return <HandsVis data={data.setTime(layersData.time).get()} height={150} />
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