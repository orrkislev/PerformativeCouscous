import { uiStateAtom } from "./UI";
import { UIRow, ToggleButton, HeaderElement } from "./UIElements";
import { useRecoilState, useRecoilValue, atom } from 'recoil';
import { useEffect } from "react";
import { M } from "./Join";
import { performanceAtom } from "./Performance";

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

    return (
        <div style={{ display: 'flex', gap: '.5em' }}>
            <HeaderElement active={page.page === 'home'} onClick={() => setpage({ page: 'home' })}>PERFORMATIVE COUSCOUS</HeaderElement>/
            <HeaderElement active={page.page === 'about'} onClick={() => setpage({ page: 'about' })}>ABOUT</HeaderElement>/
            <HeaderElement active={page.page === 'join'} onClick={() => setpage({ page: 'join', subpage: 1 })}>JOIN</HeaderElement>/
            <div>PERFORMERS</div>
            {performance && (
                <>
                /<HeaderElement active={page.page === 'performance'} onClick={() => setpage({ page: 'performance'})}>{performance.title}</HeaderElement >
                </>
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
            View Gallery By:
            <M button disabled={page.subpage != 'skill'} onClick={() => setpage({ page: 'home', subpage: 'skill' })}>Skill Level</M> /
            <M button disabled={page.subpage != 'age'} onClick={() => setpage({ page: 'home', subpage: 'age' })}>Age</M> /
            <M button disabled={page.subpage != 'intensity'} onClick={() => setpage({ page: 'home', subpage: 'intensity' })}>Movement Intensity</M> /
        </div>
    )

    if (page.page === 'performance') return (
        <div style={{ display: 'flex', gap: '5em' }}>
            <ToggleButton text="Background" active={uistate.background} func={() => setuistate({ ...uistate, background: !uistate.background })} />
            <ToggleButton text="Story" active={uistate.story} func={() => setuistate({ ...uistate, story: !uistate.story })} />
            <div>Recipe</div>
            <div>Profile</div>
        </div>
    )
}