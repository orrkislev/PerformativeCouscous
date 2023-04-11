import { getDownloadURL } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { storageRef } from '../utils/useFirebase';
import { layersDataAtom, performanceAtom } from './Layers';
import { uiStateAtom } from './UI';

export default function Story(props) {
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const uistate = useRecoilValue(uiStateAtom);
    const [src, setsrc] = useState(null);
    const ref = useRef(null);


    useEffect(() => {
        getDownloadURL(storageRef(`${performance.name}-story`)).then((url) => {
            setsrc(url);
        })
    }, [performance])

    useEffect(() => {
        if (ref.current && src) {
            ref.current.src = src;
        }
    }, [src])

    useEffect(() => {
        if (uistate.story) ref.current.play();
        else ref.current.pause();
    }, [uistate.story])

    useEffect(() => {
        if (Math.abs(ref.current.currentTime - layersData.time) > 1) ref.current.currentTime = layersData.time
    }, [layersData.time])


    return (
        <audio hidden ref={ref} />
    )
}