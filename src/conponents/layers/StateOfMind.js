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
    font-size: 0.7rem;
    min-width: 8em;
    background: rgba(0,0,0,0.5);
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
                const newData = new DataContainer(data)
                newData.lowPassFilter(.1)
                setData(newData);
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

    if (!data) return null

    const frameData = data.setTime(layersData.time).get()
    if (!frameData) return null

    const showVis = uistate.mind != null ? (uistate.mind == 1 || uistate.mind == 2) : true;
    const showVid = uistate.mind != null ? (uistate.mind == 1 || uistate.mind == 3) : true;

    let vidData = null
    if (showVid) {
        const portraitData = portrait?.setTime(layersData.time).get()
        if (portraitData) {
            vidData = {}
            const rescaleX = props.size.width / portraitData.width
            const rescaleY = props.size.height / portraitData.height
            const rescale = Math.min(rescaleX, rescaleY)

            vidData.vidWidth = 1280 * rescale
            vidData.vidHeight = 720 * rescale
            vidData.vidLeft = rescale * (portraitData.left)
            vidData.vidTop = rescale * (portraitData.top - portraitData.height / 2)
        }
    }

    const expressions = frameData[0]

    return (
        <>
            {vidData && showVid &&
                <div style={{ width: props.size.width, height: props.size.height, position: 'absolute', overflow: 'hidden' }}>
                    <video style={{
                        width: vidData.vidWidth,
                        height: vidData.vidHeight,
                        marginLeft: `-${vidData.vidLeft}px`,
                        marginTop: `-${vidData.vidTop}px`,
                        objectFit: 'cover', position: 'absolute',
                        zIndex: -1
                    }} ref={vidRef} >
                        <source src={src} type="video/mp4" />
                    </video>
                </div>
            }
            {showVis && <MindVis satisfaction={satisfactionData} focus={expressions.focus} height={props.size.height} width={props.size.width} />}
        </>
    )
}



export function MindVis(props) {
    if (!props.satisfaction) return null;


    const satisfaction = props.satisfaction[props.satisfaction.length - 1] ?? 0
    const satisfactionNum = Math.round(satisfaction * 20)
    const satisfactionDashArray = `${satisfactionNum},${20 - satisfactionNum}`

    const size = Math.min(props.height, props.width) * .8
    const heartSize = size * .15

    return (
        <StateOfMindContainer>
            <svg width={size + `px`} height={size + `px`} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={size / 3} stroke='yellow' fill="#FFFF0088" strokeDasharray={satisfactionDashArray} strokeLinecap="round" strokeWidth="4" />
                <circle cx={size / 2} cy={size / 2} r={size * .3 * props.focus} fill='yellow' />
            </svg>

            <StateOfMindText style={{ top: size / 2, left: props.width / 2 + size / 2 }}>
                <div>Focus: {Math.round(props.focus * 100)}%</div>
                <div>Satisfaction: {Math.round(satisfaction * 100)}%</div>
            </StateOfMindText>

            {/* svg of a yellow heart, size is connected to satisfaction */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={heartSize + satisfaction * heartSize*2} height={heartSize + satisfaction * heartSize*2}
                style={{ position: 'absolute', right: heartSize, bottom: heartSize, transform: 'translate(50%,50%)' }}>
                <path fill="#FFFF00" d="M12 21.35l-1.45-1.32C4.72 14.16 2 11.08 2 7.5 2 4.42 4.42 2 7.5 2c2.34 0 4.48 1.19 5.74 3.01A4.988 4.988 0 0 1 16.5 2c3.08 0 5.5 2.42 5.5 5.5 0 3.58-2.72 6.66-8.55 12.53L12 21.35z" />
            </svg>

            <StateOfMindText style={{ bottom: '25px', left: '102%' }}>
                Love
            </StateOfMindText>


        </StateOfMindContainer>
    )
}