import { useEffect, useState } from 'react';
import styled from 'styled-components'

const FloatingContainer = styled.div`
        position: absolute;
        top: ${props => props.y}px;
        left: ${props => props.x}px;
        z-index: 999;
        border: 2px solid ${props => props.color};
    `;

const FloatingHeader = styled.div`
        background: ${props => props.background};
        color: ${props => props.color};
        font-weight: bold;
        font-size: 1.3em;
        text-transform: uppercase;
        `;

const FloatingContent = styled.div`
        padding: .5em 1em;
    `;






export default function Floating(props) {
    const [pos, setPos] = useState({ x: props.x ?? 0, y: props.y ?? 0 });
    const [drag, setDrag] = useState(false);
    const [offset, setOffset] = useState({x:0, y:0});

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        function handleMouseMove(e) {
            if (drag) {
                setPos({ x: e.pageX - offset.x, y: e.pageY - offset.y });
                props.onDrag()
            }
        }

        function handleMouseUp() {
            setDrag(false);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
    }, [drag, offset, props]);
    

    function handleMouseDown(e) {
        setDrag(true);
        setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    }

    if (!props.active) return null

    return (
        <FloatingContainer color={props.colors[0]} x={pos.x} y={pos.y}>
            
            <FloatingHeader 
                background={props.colors[0]} 
                color={props.colors[1]}
                onMouseDown={handleMouseDown}
                onMouseUp={() => setDrag(false)} >
                    {props.title}
            </FloatingHeader>

            <FloatingContent>
                {props.children}
            </FloatingContent>
        </FloatingContainer>
    );
}