import { useRecoilValue } from 'recoil';
import { uiStateAtom } from './UI';

export default function Background(props) {
    const uistate = useRecoilValue(uiStateAtom);

    if (!uistate.background) return null

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'gray', zIndex: -1 }}></div>
    )
}