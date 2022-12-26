import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { save } from "../utils/useFirebase";

const BottomBarContainer = styled.div`
    margin: 3em 0;
    position:relative;
    `;


const BottomBar = styled.div`
    height: 6px;
    background-color: white;
    border-radius: 99px;
    margin:1em;
`;
const VidPreview = styled.video`
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    position: absolute;
    top: 10px;
    `;

const EventDot = styled.div`
    position: absolute;
    left: ${props => props.left}%;
    height: 20px;
    width: 20px;
    background-color: black;
    border-radius: 99px;
    outline: 5px solid white;
    bottom: -5px;
    `;
const EventDotInput = styled.input`
    position: absolute;
    bottom: 35px;
    padding: 0.5em;
    border: none;
    border-radius: 0.5em;
    font-size: .5em;
    transform: translateX(-50%);
    `;
const EventDeleteButton = styled.button`
    position: absolute;
    bottom: -35px;
    padding: 0.5em;
    border: none;
    border-radius: 0.5em;
    font-weight: bold;
    background:none;
    color: white;
    cursor: pointer;
    &:hover{
        background-color: white;
        color: black;
    }
    transition: all 0.2s ease-in-out;
    `;

export function TimeLineInput(props) {
    const [data, setData] = useState([]);
    const [hover, setHover] = useState(false);
    const [vidPosition, setVidPosition] = useState(0);
    const vidRef = useRef(null);
    const barRef = useRef(null);

    useEffect(() => {
        if (props.value) setData(props.value)
    }, [props.value])

    function updatePreview(e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        if (vidRef.current) {
            const perc = x / e.target.getBoundingClientRect().width;
            setVidPosition(x - vidRef.current.getBoundingClientRect().width * perc);
            const time = perc * vidRef.current.duration;
            vidRef.current.currentTime = time;
        }
    }

    function addData(e) {
        const x = e.clientX - barRef.current.getBoundingClientRect().left;
        const perc = x / barRef.current.getBoundingClientRect().width;
        const time = perc * vidRef.current.duration;
        setData([...data, {
            time: time,
            x: perc * 100,
            text: "test"
        }]);
    }

    function updateText(e, i) {
        const newData = [...data];
        newData[i].text = e.target.value;
        setData(newData);
    }
    function removeData(i) {
        const newData = [...data];
        newData.splice(i, 1);
        setData(newData);
    }

    function saveTimeline() {
        const timeline = data.map(d => {
            return {
                time: d.time,
                text: d.text
            }
        })
        const duration = vidRef.current.duration;
        save('performers', props.name, { timeline, duration});
    }

    return (
        <div>
            <BottomBarContainer>
                <BottomBar onMouseEnter={(e) => setHover(!hover)} onMouseLeave={(e) => setHover(!hover)} onMouseMove={updatePreview} onClick={addData} ref={barRef}>
                    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                        <VidPreview src={props.file} style={{ left: vidPosition, display: hover ? 'block' : 'none' }} ref={vidRef} />
                    </div>
                </BottomBar>
                {data.map((d, i) => {
                    if (!d.x && vidRef.current) d.x = (d.time / vidRef.current.duration) * 100;
                    if (!d.x) return null;
                    return (
                        <EventDot left={d.x} key={i}>
                            <EventDotInput value={d.text} onChange={(e) => updateText(e, i)} />
                            <EventDeleteButton onClick={() => removeData(i)}>X</EventDeleteButton>
                        </EventDot>
                    )
                })}
            </BottomBarContainer>
            <button onClick={saveTimeline}>save</button>
        </div>
    )
}