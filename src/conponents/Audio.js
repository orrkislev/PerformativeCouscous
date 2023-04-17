import { getDownloadURL } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { storageRef } from '../utils/useFirebase';
import { performanceAtom } from './Layers';
import { uiStateAtom } from './UI';

export const audioAtom = new atom({ key: 'audio', default: {} })

export default function Audio(props) {
    const performance = useRecoilValue(performanceAtom);
    const uistate = useRecoilValue(uiStateAtom);
    const [audioData, setaudioData] = useRecoilState(audioAtom);
    const [src, setsrc] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        getDownloadURL(storageRef(`${performance.name}-story`)).then((url) => {
            setsrc(url);
        })
    }, [performance])

    useEffect(() => {
        let interval
        if (ref.current && src) {
            ref.current.src = src;
            ref.current.addEventListener('ended', () => {
                ref.current.currentTime = 0;
                ref.current.play();
                ref.current.muted = !uistate.story;
            })
            ref.current.play()

            interval = setInterval(() => {
                setaudioData({ ...audioData, time: ref.current.currentTime, perc: ref.current.currentTime / ref.current.duration * 100})
            }, 200)
        }
        return () => {
            if (ref.current) {
                ref.current.pause();
                ref.current.removeEventListener('ended', () => {
                    ref.current.currentTime = 0;
                    ref.current.play();
                })
            }
            clearInterval(interval)
        }
    }, [src])

    useEffect(() => {
        if (ref.current) ref.current.muted = !uistate.story;
    }, [uistate.story])

    useEffect(() => {
        if (ref.current && audioData.setPerc) ref.current.currentTime = audioData.setPerc * ref.current.duration;
    }, [audioData.setPerc])

    return (
        <audio hidden ref={ref} />
    )
}