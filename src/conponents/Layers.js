import { useRecoilValue } from 'recoil';
import Floating from './Floating';
import { uiStateAtom } from './UI';


export const layersData = [
    { name: 'gestures', colors: ['purple','white'], text: 'Gesture' },
    { name: 'pose', colors: ['red','white'], text: 'Pose' },
    { name: 'rhythm', colors: ['blue','white'], text: 'Rhythm' },
    { name: 'mind', colors: ['yellow','black'], text: 'State of Mind' },
    { name: 'tools', colors: ['green','black'], text: 'Tools' },
    { name: 'mix', colors: ['white','black'], text: 'Mix & Match' },
]

export default function Layers(props) {
    const uistate = useRecoilValue(uiStateAtom);

    return (
        <div>
            {layersData.map((layer, i) => {
                return (
                    <Floating key={i} colors={layer.colors} title={layer.text} active={uistate[layer.name]} x={100+i*100} y={100+i*100}/>
                )
            })}
        </div>
    )
}