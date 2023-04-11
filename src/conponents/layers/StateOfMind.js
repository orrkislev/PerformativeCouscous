import { getDownloadURL } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataContainer } from "../../Edit/Data";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";
import styled from "styled-components";
import { uiStateAtom } from "../UI";

const StateOfMindContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color:yellow;
`;
const StateOfMindText = styled.div`
    position: absolute;
    bottom: 1em;
    left: 1em;
    font-size: 0.7rem;
    width: 100%;
    text-shadow: 0 0 10px yellow;
`;


export default function StateOfMind(props) {
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [data, setData] = useState(null);
    const [portrait, setPortrait] = useState(null);
    const [satisfactionData, setSatisfactionData] = useState([]);
    const [src, setsrc] = useState(null);
    const vidRef = useRef(null);
    const uistate = useRecoilValue(uiStateAtom);

    useEffect(() => {
        getDownloadURL(storageRef(`${performance.name}-expression`)).then((url) => {
            fetch(url).then((res) => res.json()).then((data) => {
                setData(new DataContainer(data));
            })
        })
        getDownloadURL(storageRef(`${performance.name}-portrait`)).then((url) => {
            fetch(url).then((res) => res.json()).then((data) => {
                setPortrait(new DataContainer(data));
            })
        })
        getDownloadURL(storageRef(`${performance.name}-front`)).then((url) => {
            setsrc(url);
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

    useEffect(() => {
        if (vidRef.current) {
            vidRef.current.currentTime = layersData.time;
        }
    }, [layersData.time])

    if (!data) return <div>...</div>

    const frameData = data.setTime(layersData.time).get()
    if (!frameData) return null

    const showVis = uistate.mind != null ? (uistate.mind == 1 || uistate.mind == 2) : true;
    const showVid = uistate.mind != null ? (uistate.mind == 1 || uistate.mind == 3) : true;

    let vidData = null
    if (showVid) {
        const portraitData = portrait?.setTime(layersData.time).get()
        if (portraitData) {
            vidData = {}
            vidData.containerHeight = props.size.height
            vidData.vidHeight = vidData.containerHeight / portraitData.height
            const ratio = portraitData.width / portraitData.height
            vidData.containerWidth = vidData.containerHeight * ratio
            if (vidData.containerWidth > props.size.width) {
                vidData.containerWidth = props.size.width
                vidData.containerHeight = vidData.containerWidth / ratio
                vidData.vidHeight = vidData.containerHeight / portraitData.height
            }
            const vidRatio = 1080 / 1920
            vidData.vidWidth = vidData.vidHeight * vidRatio
            vidData.vidLeft = portraitData.left * vidData.vidWidth
            vidData.vidTop = portraitData.top * vidData.vidHeight
        }
    }

    const expressions = frameData[0]

    return (
        <>
            {vidData && showVid &&
                <div style={{ width: props.size.width, height: props.size.height, position: 'absolute', overflow: 'hidden' }}>
                    <video style={{ width: vidData.vidWidth, height: vidData.vidHeight, marginLeft: `-${vidData.vidLeft}px`, marginTop: `-${vidData.vidTop}px`, objectFit: 'cover', position: 'absolute', zIndex: -1 }} ref={vidRef} >
                        <source src={src} type="video/mp4" />
                    </video>
                </div>
            }
            {showVis && <MindVis satisfaction={satisfactionData} focus={expressions.focus} height={150} />}
        </>
    )
}



export function MindVis(props) {
    if (!props.satisfaction) return null;

    let path = null
    // if (props.satisfaction)
    //     path = props.satisfaction.map((d, i) => {
    //         const x = i * 10;
    //         const y = 15 + d * 10;
    //         return `${i === 0 ? `M ${x} ${y}` : `T ${x} ${y}`}`
    //     }).join(' ');

    const satisfaction = props.satisfaction[props.satisfaction.length - 1] ?? 0
    const satisfactionNum = Math.round(satisfaction * 20)
    const satisfactionDashArray = `${satisfactionNum},${20 - satisfactionNum}`

    const focus = props.focus ?? 0

    return (
        <StateOfMindContainer>
            <svg width={`150px`} height={`150px`} viewBox={`0 0 150 150`}>
                <circle cx={75} cy={75} r={50} stroke='yellow' fill="#FFFF0088" strokeDasharray={satisfactionDashArray} strokeLinecap="round" strokeWidth="4" />
                <circle cx={75} cy={75} r={45 * props.focus} fill='yellow' />
            </svg>

            {/* {path && ( */}
            {/*  <div> */}
            {/* satisfaction: */}
            {/* <svg width="100%" height="100%" viewBox="0 0 100 50"> */}
            {/* <path d={path} stroke="yellow" fill="none" /> */}
            {/* </svg> */}
            {/* </div> */}
            {/* )} */}
            {/* {props.focus && ( */}
            {/* <div> */}
            {/* focus: */}
            {/* <svg width={`${props.height * 2}px`} height={`${props.height}px`} viewBox={`0 0 ${props.height * 2} ${props.height}`}>
                        <circle cx={100} cy={100} r={props.height * .2} stroke='yellow' fill="#FFFF0088" />
                        {props.focus && <circle cx={100} cy={100} r={props.height * .18 * props.focus} fill='yellow' />}
                    </svg> */}
            {/* </div> */}
            {/* )} */}
            <StateOfMindText>
                Focus: {Math.round(props.focus * 100)}%<br />
                Satisfaction: {Math.round(satisfaction * 100)}%
            </StateOfMindText>
        </StateOfMindContainer>
    )
}