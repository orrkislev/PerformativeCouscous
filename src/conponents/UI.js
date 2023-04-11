import { atom, useRecoilState, useRecoilValue } from 'recoil';
import Header, { pageAtom } from './Header';
import { layersPerfs } from './Layers';
import { SideBarButton, UIContainer } from './UIElements';
import Profile from './Profile';

export const uiStateAtom = new atom({
    key: 'UIState', default: {
        gestures: false, pose: false, rhythm: false, mind: false, tools: false, mix: false,
        background: false, story: false, profile: false
    }
});

export default function UI() {
    const page = useRecoilValue(pageAtom);
    const uistate = useRecoilValue(uiStateAtom);

    console.log(uistate)

    return (
        <UIContainer>
            <Header />
            {page.page === "performance" && !uistate.profile && <SideBarPerformance />}
            {page.page === "performance" &&  uistate.profile && <Profile />}
        </UIContainer>
    );
}

function SideBarPerformance(props) {
    const [uistate, setuistate] = useRecoilState(uiStateAtom);

    return (
        <>
            {layersPerfs.map((layer, i) => {
                return (
                    <SideBarButton key={i} 
                        text={layer.text} 
                        colors={layer.colors}
                        active={uistate[layer.name]} 
                        func={() => setuistate({ ...uistate, [layer.name]: !uistate[layer.name] })} />
                )
            })}
        </>
    )
}