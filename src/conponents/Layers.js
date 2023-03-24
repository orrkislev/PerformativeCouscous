import { useEffect } from 'react';
import { useRecoilValue, useRecoilState, atom } from 'recoil';
import Floating from './Floating';
import Gesture from './layers/Gesture';
import Pose from './layers/Pose';
import Rhythm from './layers/Rhythm';
import StateOfMind from './layers/StateOfMind';
import Timeline from './layers/TimeLine';
import { uiStateAtom } from './UI';

export const layersDataAtom = atom({ key: 'layersData', default: { time: 0, reset: 0 } });
export const performanceAtom = new atom({ key: 'performance', default: {} });


export const layersPerfs = [
    { name: 'gestures', colors: ['#ff00ff', 'white'], text: 'GESTURE',       component: Gesture },
    { name: 'pose',     colors: ['#ff0000', 'white'], text: 'POSE',          component: Pose },
    { name: 'rhythm',   colors: ['#0000ff', 'white'], text: 'RHYTHM',        component: Rhythm },
    { name: 'mind',     colors: ['#ffff00', 'black'], text: 'STATE OF MIND', component: StateOfMind },
    { name: 'tools',    colors: ['#00ff00', 'black'], text: 'TOOLS',         component: null },
    { name: 'timeline', colors: ['#ffffff', 'black'], text: 'TIMELINE',      component: (<Timeline />), notFloating: true },
    { name: 'empty',    colors: ['#000000', 'black'], text: '',              component: null },
]

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
                return (
                    <Floating key={i} 
                        component={layer.component}
                        colors={layer.colors} 
                        title={layer.text} 
                        active={uistate[layer.name]} 
                        x={100 + i * 100} 
                        y={100 + i * 100} />
                )
            })}
        </div>
    )
}