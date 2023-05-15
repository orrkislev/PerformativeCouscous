import { useEffect } from 'react';
import { useRecoilValue, useRecoilState, atom } from 'recoil';
import Floating from './Floating';
import Gesture from './layers/Gesture';
import Pose from './layers/Pose';
import Rhythm from './layers/Rhythm';
import StateOfMind from './layers/StateOfMind';
import { uiStateAtom } from './UI';

export const layersDataAtom = atom({ key: 'layersData', default: { time: 0, reset: 0 } });
export const performanceAtom = new atom({ key: 'performance', default: {} });


export const layersPerfs = [
    { name: 'gestures',  colors: ['#ff00ff', 'white'], text: 'GESTURE', component: Gesture, toggle: 'gesture',
        subtext:'The choreography of the hands in relation to the material'},
    { name: 'pose',      colors: ['#ff0000', 'white'], text: 'POSE', component: Pose,
        subtext:'Muscle effort and origin of movement'},
    { name: 'rhythm',    colors: ['#0000ff', 'white'], text: 'RHYTHM', component: Rhythm, toggle: 'rhythm',
        subtext:'The body tempo, originating in the hips, translated to sound' },
    { name: 'mind',      colors: ['#ffff00', 'black'], text: 'STATE OF MIND', component: StateOfMind, toggle: 'mind',
        subtext:'Facial expressions showing levels of focus and satisfaction' },
    { name: 'empty',     colors: ['#000000', 'black'], text: '', component: null },
]

const minSize = 230
function getInitialLayerPosSize(name) {
    let width = minSize + Math.random() * 60;
    let height = minSize + Math.random() * 60;
    if (name=='pose') {
        height = window.innerHeight * 0.7;
        width = height * 0.6;
    }
    let x = Math.random() * (window.innerWidth - width);
    let y = Math.random() * (window.innerHeight - height);
    return { x, y, width, height };
}

export default function Layers(props) {
    const uistate = useRecoilValue(uiStateAtom);
    const [layersData, setLayersData] = useRecoilState(layersDataAtom);
    const performance = useRecoilValue(performanceAtom);

    useEffect(() => {
        const interval = setInterval(() => {
            if (layersData.time < performance.duration) setLayersData({ ...layersData, time: layersData.time + 1 / 20 });
            else setLayersData({ ...layersData, time: 0, reset: layersData.reset + 1 });
        }, 50);
        return () => clearInterval(interval);
    }, [layersData.time])

    return (
        <div>
            {layersPerfs.map((layer, i) => {
                if (layer.notFloating && uistate[layer.name]) return layer.component;
                const posSize = getInitialLayerPosSize(layer.name);
                return (
                    <Floating key={i}
                        component={layer.component}
                        colors={layer.colors}
                        title={layer.text}
                        active={uistate[layer.name]}
                        toggle={layer.toggle}
                        subtext={layer.subtext}
                        x={posSize.x} y={posSize.y} width={posSize.width} height={posSize.height} />
                )
            })}

        </div>
    )
}