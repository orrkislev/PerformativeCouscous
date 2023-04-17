import { createElement, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components'
import { uiStateAtom } from './UI';

const FloatingContainer = styled.div`
    position: absolute;
    z-index: 998;
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
    white-space: nowrap;
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

const minSize = 230
export default function Floating(props) {
    const uistate = useRecoilValue(uiStateAtom)

    const [pos, setPos] = useState({ x: props.x ?? 0, y: props.y ?? 0 });
    const [size, setSize] = useState({ width: props.width ?? minSize, height: props.height ?? minSize });

    const [drag, setDrag] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [resize, setResize] = useState(false);

    const [hover, setHover] = useState(false);
    const thisRef = useRef(null)

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);


        function handleMouseMove(e) {
            if (drag) {
                const x = Math.min(Math.max(e.pageX - offset.x, 0), window.innerWidth - thisRef.current.getBoundingClientRect().width);
                const y = Math.min(Math.max(e.pageY - offset.y, 0), window.innerHeight - thisRef.current.getBoundingClientRect().height);
                setPos({ x, y });
            }
            if (resize) {
                const newWidth = Math.max(e.pageX - pos.x, minSize);
                const newHeight = Math.max(e.pageY - pos.y, minSize);
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

        const allFloating = document.querySelectorAll('.floating');
        allFloating.forEach(floating => {
            floating.style.zIndex = 998;
        })
        thisRef.current.style.zIndex = 999;
    }

    function startResize(e) {
        setResize(true);
        setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
        window.addEventListener("mouseup", handleMouseUp);
    }

    if (!props.active) return null

    let component = createElement(props.component, { size: { width: size.width, height: size.height - 25 } });

    return (
        <>
            {props.subtext && hover && <FloatingSubtext text={props.subtext} color={props.colors[0]} />}
            <FloatingContainer className="floating" style={{ left: pos.x, top: pos.y, width: size.width, height: size.height, display: uistate.profile ? 'none' : 'block' }}
                color={props.colors[0]} ref={thisRef}>

                <FloatingHeader
                    background={props.colors[0]}
                    color={props.colors[1]}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onMouseDown={handleMouseDown}
                    onMouseUp={() => setDrag(false)} >
                    {props.title}

                    {props.toggle &&
                        <FloatingToggles name={props.toggle} color={props.colors[0]} color2={props.colors[1]} />
                    }
                </FloatingHeader>

                {component}

                <FloatingResize
                    color={props.colors[0]}
                    onMouseDown={startResize}
                    onMouseUp={() => setResize(false)} />
            </FloatingContainer>
        </>
    );
}

function FloatingToggles(props) {
    const [uistate, setUIState] = useRecoilState(uiStateAtom)
    const [dataState, setDataState] = useState(true);
    const [videoState, setVideoState] = useState(true);

    useEffect(() => {
        let stateNum = -1
        if (dataState && videoState) stateNum = 1
        else if (dataState && !videoState) stateNum = 2
        else if (!dataState && videoState) stateNum = 3
        setUIState({ ...uistate, [props.name]: stateNum })
    }, [videoState, dataState])

    const states = { 1: 'DATA & VIDEO', 2: 'DATA', 3: 'VIDEO' };

    const activeStyle = { background: props.color2, color: props.color }
    const inactiveStyle = { color: props.color2 }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2em', fontSize: '0.5em', marginRight: '0.4em' }}>
            <div style={dataState ? activeStyle : inactiveStyle} onClick={() => setDataState(!dataState)}>
                DATA
            </div>

            <div style={videoState ? activeStyle : inactiveStyle} onClick={() => setVideoState(!videoState)}>
                VIDEO
            </div>
        </div>
    )
}

function FloatingSubtext(props) {
    const [show, setShow] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);

        function handleMouseMove(e) {
            setMousePos({ x: e.pageX, y: e.pageY });
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        }
    }, []);

    useEffect(()=>{
        setShow(false)
        const timeout = setTimeout(()=>setShow(true), 500)
        return ()=>clearTimeout(timeout)
    }, [mousePos])

    if (!show) return null

    return (
        <div style={{
            position: 'absolute',
            top: mousePos.y - 40,
            left: mousePos.x - 100,
            color: props.color,
            textShadow: '0 0 10px ' + props.color,
            textAlign: 'center',
        }}>
            {props.text}
        </div>
    )
}