import styled from "styled-components";
import { pageAtom } from "./Header";
import { useRecoilState } from 'recoil';

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

    if (page.subpage === 1) return (
        <Centered>
            <div>
                <p>hank you for joining the <M>PERFORMATIVE COUSCOUS ARCHIVE.</M></p>
                <p>We believe that anyone is a performer and everyone is welcome to join our archive. We will invite you for a short cooking & filming session (or come to you).</p>
                <p>First, we have 4 questions that will help us define your performer profile.</p>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <div></div>
                <JoinButton onClick={() => setpage({page:'join', subpage:2})}>Next</JoinButton>
            </div>
        </Centered>
    )

    if (page.subpage === 2) return (
        <Centered>
            <div>
                <p>1. How often do you make couscous?</p>
                <p><M button>Never</M></p>
                <p><M button>Rarely</M></p>
                <p><M button>For Special occasions and holidays</M></p>
                <p><M button>Once a Month</M></p>
                <p><M button>Once a Week</M></p>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <JoinButton inversed onClick={() => setpage({page:'join', subpage:1})}>Back</JoinButton>
                <JoinButton onClick={() => setpage({page:'join', subpage:3})}>Next</JoinButton>
            </div>
        </Centered>
    )

    if (page.subpage === 3) return (
        <Centered>
            <div>
                <p>2. Does couscous making run in your family?</p>
                <p><M button>1st generation (starts with me)</M></p>
                <p><M button>2nd generation (parents)</M></p>
                <p><M button>3rd generation + (grandparents and back)</M></p>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <JoinButton inversed onClick={() => setpage({page:'join', subpage:2})}>Back</JoinButton>
                <JoinButton onClick={() => setpage({page:'join', subpage:4})}>Next</JoinButton>
            </div>
        </Centered>
    )

    if (page.subpage === 4) return (
        <Centered>
            <div>
                <p>3. Where does your recipe originate from?</p>
                <p><M button>Morocco</M></p>
                <p><M button>Algeria</M></p>
                <p><M button>Tunisia</M></p>
                <p><M button>Other (Dropdown)</M></p>
                <br/>
                <p>4. Where are you living and making couscous at the moment?</p>
                <p><M button>DropDown</M></p>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>Thank you for your answers. We will get back to you soon.</p>
                <JoinButton onClick={() => setpage({page:'join', subpage:5})}>join</JoinButton>
            </div>
        </Centered>
    )

    if (page.subpage === 5) return (
        <Centered>
            <div>
                <p>Thank you for joining us!</p>
                <p>We will contact you in the next few days.</p>
                <br/>
                <p>We invite you to browse through the <M button onClick={()=>setpage({page:'home'})}>PERFORMERS</M> in the archive.</p>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <JoinButton onClick={() => setpage({page:'home'})}>Good</JoinButton>
            </div>
        </Centered>
    )

    return null
}