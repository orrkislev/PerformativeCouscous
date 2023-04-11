import { uiStateAtom } from "./UI";
import { UIRow, ToggleButton, HeaderElement, ToggleSmallButton } from "./UIElements";
import { useRecoilState, useRecoilValue, atom, useResetRecoilState } from 'recoil';
import { useEffect } from "react";
import { M } from "./Join";
import { performanceAtom, layersDataAtom} from "./Layers";

export const pageAtom = new atom({
    key: 'page', default: {
        page: 'home', subpage: 'home'
    }
});

export default function Header() {
    return (
        <UIRow>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <HeaderLeft />
                <HeaderRight />
            </div>
        </UIRow>
    )
}

function HeaderLeft(props) {
    const [page, setpage] = useRecoilState(pageAtom);
    const performance = useRecoilValue(performanceAtom);

    const resetPerformance = useResetRecoilState(performanceAtom)
    const resetLayers = useResetRecoilState(layersDataAtom)
    const gotoPage = (pageData) => {
        resetPerformance()
        resetLayers()
        setpage(pageData)
    }

    return (
        <div style={{ display: 'flex', gap: '.5em' }}>
            <HeaderElement active={page.page === 'home'} onClick={() => gotoPage({ page: 'home' })}>PERFORMATIVE COUSCOUS</HeaderElement>/
            <HeaderElement active={page.page === 'about'} onClick={() => gotoPage({ page: 'about' })}>ABOUT</HeaderElement>/
            <HeaderElement active={page.page === 'join'} onClick={() => gotoPage({ page: 'join', subpage: 1 })}>JOIN</HeaderElement>/
            {performance && (
                <HeaderElement active={page.page === 'performance'} onClick={() => setpage({ page: 'performance'})}>{performance.name}</HeaderElement >
            )}
        </div>
    )
}
function HeaderRight(props) {
    const [uistate, setuistate] = useRecoilState(uiStateAtom);
    const [page, setpage] = useRecoilState(pageAtom);

    useEffect(() => {
        if (page.page === 'home')
            if (!['skill', 'age', 'intensity'].includes(page.subpage))
                setpage({ page: 'home', subpage: 'skill' })
    }, [page])

    if (page.page === 'home') return (
        <div>
            <span style={{marginRight:'.5em'}}>View Gallery By:</span>
            <M button disabled={page.subpage != 'skill'} onClick={() => setpage({ page: 'home', subpage: 'skill' })}>Skill Level</M> /
            <M button disabled={page.subpage != 'age'} onClick={() => setpage({ page: 'home', subpage: 'age' })}>Age</M> /
            <M button disabled={page.subpage != 'intensity'} onClick={() => setpage({ page: 'home', subpage: 'intensity' })}>Movement Intensity</M>
        </div>
    )

    if (page.page === 'performance') return (
        <div style={{ display: 'flex', gap: '5em' }}>
            <ToggleButton text="Background" active={uistate.background} func={() => setuistate({ ...uistate, background: !uistate.background })} />
            <ToggleButton text="Story" active={uistate.story} func={() => setuistate({ ...uistate, story: !uistate.story })} />
            <ToggleSmallButton text="Profile" active={uistate.profile} func={() => setuistate({ ...uistate, profile: !uistate.profile })} />
        </div>
    )
}