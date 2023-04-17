import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { layersDataAtom, performanceAtom } from "../Layers";
import { SideBarButton } from "../UIElements";
import { uiStateAtom } from "../UI";
import { useRef } from "react";

export const TimelineClickContainer = styled.div`
    bottom: ${props => props.bottom || '0'};
    width: 100%;
    padding: 0.5rem 0;
    cursor: pointer;
`;
export const TimelineContainer = styled.div`
    height: 5px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #00000066;
`;
export const TimelineBar = styled.div`
    background-color: ${props => props.color};
    height: 5px;
    border-radius: 5px;
`;


export default function Timeline(props) {
    const performance = useRecoilValue(performanceAtom);
    const [layersData, setLayersData] = useRecoilState(layersDataAtom);
    const [uistate,setuistate] = useRecoilState(uiStateAtom)
    const ref = useRef(null)

    const perc = layersData.time / performance.duration * 100;

    const click = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const perc = Math.max(0, Math.min(x / rect.width, 1));
        const time = perc * performance.duration;
        setLayersData({ ...layersData, time });
    }

    return (
        <div style={{ display: 'flex' }}>
            <SideBarButton
                text='TIMELINE'
                func={() => setuistate({ ...uistate, timeline: !uistate.timeline })}
                active={uistate.timeline}
                colors={['#ffffff', 'black']}
            />
            {uistate.timeline &&
                <TimelineClickContainer onMouseDown={click} bottom='3em' ref={ref}>
                    <TimelineContainer>
                        <TimelineBar style={{ width: `${perc}%` }} color='white' />
                    </TimelineContainer>
                </TimelineClickContainer>
            }
        </div>
    )
}