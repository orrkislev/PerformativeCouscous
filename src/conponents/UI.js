import { atom, useRecoilState, useRecoilValue } from 'recoil';
import Header, { pageAtom } from './Header';
import { layersData } from './Layers';
import { SideBarButton, UIContainer } from './UIElements';

export const uiStateAtom = new atom({
    key: 'UIState', default: {
        gestures: false, pose: false, rhythm: false, mind: false, tools: false, mix: false,
        background: false, story: false,
    }
});

export default function UI() {
    const page = useRecoilValue(pageAtom);

    return (
        <UIContainer>
            <Header />
            {page.page === "performance" && <SideBarPerformance />}
        </UIContainer>
    );
}

function SideBarPerformance(props) {
    const [uistate, setuistate] = useRecoilState(uiStateAtom);

    return (
        <>
            {layersData.map((layer, i) => {
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