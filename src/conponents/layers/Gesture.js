import { getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataTimer } from "../../Edit/FrontUpload";
import { HandsVis } from "../../Edit/TopUpload";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";

export default function Gesture(props){
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [dataTimer, setDataTimer] = useState(null);

    useEffect(()=>{
        getDownloadURL(storageRef(`${performance.name}-gesture`)).then((url) => {
            fetch(url).then((res) => res.json()).then((data) => {
                setDataTimer(new DataTimer(data));
            })
        })
    }, [performance])

    useEffect(()=>{
        if (dataTimer) dataTimer.reset()
    }, [layersData.reset])

    if (!dataTimer) return <div>...</div>
    
    return <HandsVis data={dataTimer.getDataforTime(layersData.time)} height={150}/>
}