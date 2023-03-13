import { useState } from 'react';
import styled from 'styled-components';

export const UIContainer = styled.div`
    position: absolute;
    top:1em;
    left:1em;
    right:1em;
    bottom:1em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 1em;
    color: white;
    font-weight: bold;
    `;

export const UIRow = styled.div`
    width: 100%;
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
    ${props => props.active && `background: ` + props.color + `; `};
    ${props => props.active && `color: ` + props.hoverTextColor + `; `};
    `;

export function SideBarButton(props) {
    const [hover, setHover] = useState(false);

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

            {extra}
        </UIRow>
    );
}

export function ToggleButton(props) {
    const markStyle = { backgroundColor: 'white', color: 'black' }
    return (
        <div onClick={props.func}>
            {props.text + " "}
            <span style={props.active ? markStyle : {}}>ON</span>/<span style={props.active ? {} : markStyle}>OFF</span>
        </div>
    );
}