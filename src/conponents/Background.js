import { getDownloadURL } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { storageRef } from '../utils/useFirebase';
import { layersDataAtom, performanceAtom } from './Layers';
import { uiStateAtom } from './UI';

export default function Background(props) {
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const uistate = useRecoilValue(uiStateAtom);
    const [src, setsrc] = useState(null);
    const vidRef = useRef(null);


    useEffect(()=>{
        getDownloadURL(storageRef(`${performance.name}-front`)).then((url) => {
            setsrc(url);
        })
    }, [performance])

    useEffect(()=>{
        if(vidRef.current){
            vidRef.current.currentTime = layersData.time;
        }
    }, [layersData.time])


    if (!uistate.background) return null

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'gray', zIndex: -1 }}>
            <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} ref={vidRef} >
                <source src={src} type="video/mp4" />
            </video>
        </div>
    )
}