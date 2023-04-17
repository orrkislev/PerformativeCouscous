import { useRecoilState } from 'recoil';
import { TimelineBar, TimelineClickContainer, TimelineContainer } from './layers/TimeLine';
import { audioAtom } from './Audio';
import { uiStateAtom } from './UI';
import { SideBarButton } from './UIElements';
import { useRef } from 'react';

export default function Story(props) {
    const [audioData, setaudioData] = useRecoilState(audioAtom);
    const [uistate, setuistate] = useRecoilState(uiStateAtom)
    const ref = useRef(null)

    const click = (e) => {
        const x = e.clientX - ref.current.getBoundingClientRect().left;
        const perc = x / ref.current.getBoundingClientRect().width;
        setaudioData({ ...audioData, setPerc: perc });
    }

    return (
        <div style={{ display: 'flex' }}>
            <SideBarButton
                text='STORY'
                func={() => setuistate({ ...uistate, story: !uistate.story })}
                active={uistate.story}
                colors={['#00ff00', 'black']}
            />
            {uistate.story &&
                <TimelineClickContainer onClick={click} bottom='2em' ref={ref}>
                    <TimelineContainer>
                        <TimelineBar style={{ width: `${audioData.perc}%` }} color='#00ff00' />
                    </TimelineContainer>
                </TimelineClickContainer>
            }
        </div>
    )
}


