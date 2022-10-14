import styled from "styled-components";
import { pageAtom } from "./Header";
import { useRecoilState } from 'recoil';
import { useState } from "react";

export const Centered = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 35em;
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
    const [page, setpage] = useRecoilState(pageAtom);
    const [answers, setanswers] = useState({ 1: null, 2: null, 3: null, 4: null })


    if (page.subpage === 1) return (
        <Centered>
            <div>
                <p>hank you for joining the <M>PERFORMATIVE COUSCOUS ARCHIVE.</M></p>
                <p>We believe that anyone is a performer and everyone is welcome to join our archive. We will invite you for a short cooking & filming session (or come to you).</p>
                <p>First, we have 4 questions that will help us define your performer profile.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div></div>
                <JoinButton onClick={() => setpage({ page: 'join', subpage: 2 })}>Next</JoinButton>
            </div>
        </Centered>
    )

    if (page.subpage === 2) return (
        <Centered>
            <div>
                <p>1. How often do you make couscous?</p>
                <Selection
                    options={['Never', 'Rarely', 'For Special occasions and holidays', 'Once a Month', 'Once a Week']}
                    selected={answers[1]} onChange={(i) => setanswers({ ...answers, 1: i })} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <JoinButton inversed onClick={() => setpage({ page: 'join', subpage: 1 })}>Back</JoinButton>
                <JoinButton onClick={() => setpage({ page: 'join', subpage: 3 })}>Next</JoinButton>
            </div>
        </Centered>
    )

    if (page.subpage === 3) return (
        <Centered>
            <div>
                <p>2. Does couscous making run in your family?</p>
                <Selection
                    options={['1st generation (starts with me)','2nd generation (parents)','3rd generation + (grandparents and back)']}
                    selected={answers[2]} onChange={(i) => setanswers({ ...answers, 2: i })} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <JoinButton inversed onClick={() => setpage({ page: 'join', subpage: 2 })}>Back</JoinButton>
                <JoinButton onClick={() => setpage({ page: 'join', subpage: 4 })}>Next</JoinButton>
            </div>
        </Centered>
    )

    if (page.subpage === 4) return (
        <Centered>
            <div>
                <p>3. Where does your recipe originate from?</p>
                <Selection
                    options={['Morocco','Algeria','Tunisia','Other']}
                    selected={answers[3]} onChange={(i) => setanswers({ ...answers, 3: i })} />
                <br />
                <p>4. Where are you living and making couscous at the moment?</p>
                <p><M button>DropDown</M></p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p>Thank you for your answers. We will get back to you soon.</p>
                <JoinButton onClick={() => setpage({ page: 'join', subpage: 5 })}>join</JoinButton>
            </div>
        </Centered>
    )

    if (page.subpage === 5) return (
        <Centered>
            <div>
                <p>Thank you for joining us!</p>
                <p>We will contact you in the next few days.</p>
                <br />
                <p>We invite you to browse through the <M button onClick={() => setpage({ page: 'home' })}>PERFORMERS</M> in the archive.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <JoinButton onClick={() => setpage({ page: 'home' })}>Good</JoinButton>
            </div>
        </Centered>
    )

    return null
}



function Selection(props) {
    return (
        <>
            {props.options.map((option, i) => (
                <p><M button selected={props.selected === i} onClick={() => props.onChange(i)}>{option}</M></p>
            ))}
        </>

    )
}