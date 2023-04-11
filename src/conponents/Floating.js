import { createElement, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components'
import { uiStateAtom } from './UI';

const FloatingContainer = styled.div`
    position: absolute;
    z-index: 999;
    border: 2px solid ${props => props.color};
`;

const FloatingHeader = styled.div`
    background: ${props => props.background};
    color: ${props => props.color};
    font-weight: bold;
    font-size: 1.3em;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
`;

const FloatingResize = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-left: 1em solid transparent;
    border-bottom: 1em solid ${props => props.color};
    cursor: nwse-resize;
`;


const FloatingTitleToggle = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 3px solid white;
    cursor: pointer;
`;




export default function Floating(props) {
    const [pos, setPos] = useState({ x: props.x ?? 0, y: props.y ?? 0 });
    const [drag, setDrag] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const [resize, setResize] = useState(false);
    const [size, setSize] = useState({ width: props.width ?? 200, height: props.height ?? 200 });

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);


        function handleMouseMove(e) {
            if (drag) setPos({ x: e.pageX - offset.x, y: e.pageY - offset.y });
            if (resize) {
                const newWidth = Math.max(e.pageX - pos.x, 50);
                const newHeight = Math.max(e.pageY - pos.y, 200);
                setSize({ width: newWidth, height: newHeight });
            };
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        }
    }, [drag, offset, props]);

    function handleMouseUp() {
        setDrag(false);
        setResize(false);
        window.removeEventListener("mouseup", handleMouseUp);
    }

    function handleMouseDown(e) {
        setDrag(true);
        setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
        window.addEventListener("mouseup", handleMouseUp);
    }

    function startResize(e) {
        setResize(true);
        setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
        window.addEventListener("mouseup", handleMouseUp);
    }

    if (!props.active) return null

    let component = createElement(props.component, { size: { width: size.width, height: size.height - 25 } });


    return (
        <FloatingContainer style={{ left: pos.x, top: pos.y, width: size.width, height: size.height }}
            color={props.colors[0]} >

            <FloatingHeader
                background={props.colors[0]}
                color={props.colors[1]}
                onMouseDown={handleMouseDown}
                onMouseUp={() => setDrag(false)} >
                {props.title}

                {props.toggle &&
                    <FloatingToggles name={props.toggle}/>   
                }
            </FloatingHeader>

            {component}

            <FloatingResize
                color={props.colors[0]}
                onMouseDown={startResize}
                onMouseUp={() => setResize(false)} />
        </FloatingContainer>
    );
}

function FloatingToggles(props) {
    const [uistate, setUIState] = useRecoilState(uiStateAtom)
    const [state,setState] = useState(1);

    useEffect(()=>{
        setUIState({...uistate,[props.name]:state})
    },[state])


    function click() {
        setState(((state+1) % 3) + 1);
    }

    const states = {1:'DATA & VIDEO', 2:'DATA', 3:'VIDEO'};

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2em', fontSize: '0.5em', marginRight: '0.4em', cursor: 'pointer' }}
            onClick={click}>
            {states[state]}
        </div>
    )
}