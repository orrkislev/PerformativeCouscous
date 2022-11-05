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
    { name: 'gestures', colors: ['purple', 'white'], text: 'Gesture', component: (<Gesture />) },
    { name: 'pose', colors: ['red', 'white'], text: 'Pose', component: (<Pose />) },
    { name: 'rhythm', colors: ['blue', 'white'], text: 'Rhythm', component: (<Rhythm />) },
    { name: 'mind', colors: ['yellow', 'black'], text: 'State of Mind', component: (<StateOfMind />) },
    { name: 'tools', colors: ['green', 'black'], text: 'Timeline & Tools', component: (<></>) },
    { name: 'empty', colors: ['black', 'black'], text: '', component: (<></>) },
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
                return (
                    <Floating key={i} colors={layer.colors} title={layer.text} active={uistate[layer.name]} x={100 + i * 100} y={100 + i * 100}>
                        {layer.component}
                    </Floating>
                )
            })}
        </div>
    )
}