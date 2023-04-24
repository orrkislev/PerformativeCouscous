import { useEffect, useState } from 'react';
import styled from 'styled-components';

export const UIContainer = styled.div`
    position: absolute;
    margin: 2em;
    top:0;
    left:0;
    right:0;
    bottom:0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;
    font-weight: bold;
    `;

export const UIRow = styled.div`
    display: flex;    
    `;

export const HeaderElement = styled.div`
    cursor: pointer;
    ${props => props.active && `background: white;`};
    ${props => props.active && `color: black;`};
    `;

export const SideBarElement = styled.div`
    cursor: pointer;
    color: ${props => props.color};
    padding: 0.2em 0;
    margin-right: 1em;
    ${props => props.active && `background: ` + props.color + `; `};
    ${props => props.active && `color: ` + props.hoverTextColor + `; `};
    `;

export function SideBarButton(props) {
    const [hover, setHover] = useState(false);
    const [tooltip, setTooltip] = useState(false);

    useEffect(() => {
        let timeout
        if (hover) {
            const setTooltipTimeout = () => {
                clearTimeout(timeout)
                timeout = setTimeout(() => { setTooltip(true) }, 500);
            }
            window.addEventListener('mousemove', setTooltipTimeout)

            return () => {
                window.removeEventListener('mousemove', setTooltipTimeout)
                clearInterval(timeout)
            }
        } else {
            clearInterval(timeout)
            setTooltip(false)
        }
    }, [hover])

    let extra = null
    if (props.withClose) extra = (
        <div style={{ flex: 1, textAlign: 'right' }}>
            <span style={{ cursor: 'pointer', color: 'white' }} onClick={props.closeFunc}>X</span>
        </div>
    )

    return (
        <UIRow>
            <SideBarElement
                color={props.colors[0]}
                hoverTextColor={props.colors[1]}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                active={hover || props.active}
                onClick={props.func}>

                {props.text}

            </SideBarElement>

            {props.tooltip && tooltip &&
                <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{
                        position: 'absolute',
                        background: 'rgba(0,0,0,0.3)',
                        color: props.colors[0],
                        padding: '0.5em',
                        fontSize: '0.7rem',
                        border: '1px solid ' + props.colors[0],
                    }}>
                        {props.tooltip}
                    </div>
                </div>
            }

            {extra}
        </UIRow>
    );
}

export function ToggleButton(props) {
    const markStyle = { backgroundColor: 'white', color: 'black' }
    return (
        <div onClick={props.func} style={{ background: 'black' }}>
            {props.text + " "}
            <span style={props.active ? markStyle : {}}>ON</span>/<span style={props.active ? {} : markStyle}>OFF</span>
        </div>
    );
}

export function ToggleSmallButton(props) {
    const defaultStyle = { backgroundColor: 'black', color: 'white' }
    const markStyle = { backgroundColor: 'white', color: 'black' }
    return (
        <div onClick={props.func}>
            <span style={props.active ? markStyle : defaultStyle}>{props.text}</span>
        </div>
    );
}