import { useState } from "react";
import styled from "styled-components";

export const Centered = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${ props=>props.wide ? '70%' : '50%'};
    transform: translate(-50%, -50%);
    font-weight: 600;
    display: flex;
    gap:5em;
    flex-direction: column;
    justify-content: space-between;
    z-index: 100;
`;
export const M = styled.span`
    ${props => props.button && `cursor: pointer;`};
    background-color: white;
    color: black;
    ${props => props.disabled && `
        background-color: unset;
        color: unset;
    `};
    ${props => props.selected && `
        outline: 1px solid white;
        outline-offset: 5px;
    `};
    `;

const JoinButton = styled.div`
    cursor: pointer;
    background-color: white;
    color: black;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 1.2em;
    padding: .5em 1em;
    ${props => props.inversed && `
        background-color: black;
        color: white;
        border: 2px solid white;
    `}
    `;

export default function Join(props) {
    const [state, setState] = useState(1)

    const sendUsEmail = () => {
        window.open('mailto:ayabentur@gmail.com');

        setTimeout(() => {
            setState(2)
        }, 1000)
    }

    if (state == 1)
        return (
            <Centered>
                <div>
                    <p>Thank you for your interest in the  <M>PERFORMATIVE COUSCOUS ARCHIVE.</M> </p>
                    <br/>
                    <p>We believe that anyone is a performer and everyone is welcome to join our archive. It doesn’t matter if you are a pro or a beginner who wants to try making couscous for the first time. </p>
                    <p>Follow the link to email us, and we will invite you for a short cooking & filming session (or come to you).</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div></div>
                    <JoinButton onClick={sendUsEmail}>JOIN US</JoinButton>
                </div>
            </Centered>
        )
    else
        return (
            <Centered>
                <div>
                    <p>Thank you for joining us!</p>
                    <p>We will contact you in the next few days.</p>
                    <br/>
                    <p>We invite you to browse through the PERFORMERS in the archive.</p>
                </div>
            </Centered>
        )
}