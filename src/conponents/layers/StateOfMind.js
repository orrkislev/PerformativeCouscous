import { getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataContainer } from "../../Edit/Data";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";
import styled from "styled-components";

const StateOfMindContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color:yellow;
`;


export default function StateOfMind(props) {
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [data, setData] = useState(null);
    const [satisfactionData, setSatisfactionData] = useState([]);

    useEffect(() => {
        getDownloadURL(storageRef(`${performance.name}-expression`)).then((url) => {
            fetch(url).then((res) => res.json()).then((data) => {
                setData(new DataContainer(data));
            })
        })
    }, [performance])

    useEffect(() => {
        if (data) {
            const newData = [...satisfactionData];
            const frameData = data.setTime(layersData.time).get()
            if (!frameData) return;
            const expressions = frameData[0]
            if (newData.length > 12) newData.shift();
            setSatisfactionData([...newData, expressions.satisfaction])
        }
    }, [data, layersData])

    if (!data) return <div>...</div>

    const frameData = data.setTime(layersData.time).get()
    if (!frameData) return null

    const expressions = frameData[0]

    return (
        <MindVis satisfaction={satisfactionData} focus={expressions.focus} />
    )
}



export function MindVis(props) {

    let path = null
    if (props.satisfaction)
        path = props.satisfaction.map((d, i) => {
            const x = i * 10;
            const y = 15 + d * 10;
            return `${i === 0 ? `M ${x} ${y}` : `T ${x} ${y}`}`
        }).join(' ');

    return (
        <StateOfMindContainer>
            {path && (
                <div>
                    satisfaction:
                    <svg width="100%" height="100%" viewBox="0 0 100 50">
                        <path d={path} stroke="yellow" fill="none" />
                    </svg>
                </div>
            )}
            {props.focus && (
                <div>
                    focus:
                    <svg width={`${props.height * 2}px`} height={`${props.height}px`} viewBox={`0 0 ${props.height * 2} ${props.height}`}>
                        <circle cx={100} cy={100} r={props.height * .2} stroke='yellow' fill="#FFFF0088" />
                        <circle cx={100} cy={100} r={props.height * .18 * props.focus} fill='yellow' />
                    </svg>
                </div>
            )}
        </StateOfMindContainer>
    )
}