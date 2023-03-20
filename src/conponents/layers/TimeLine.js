import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { layersDataAtom, performanceAtom } from "../Layers";

const TimelineContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2rem;
    padding: 0.5rem;
`;
const TimelineBar = styled.div`
    position: relative;
    background-color: white;
    border-radius: 5px;
    height: 5px;
    `;


export default function Timeline(props) {
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);

    const perc = layersData.time / performance.duration * 100;

    return (
        <TimelineContainer>
            <TimelineBar style={{ width: `${perc}%` }} />
        </TimelineContainer>
    )
}