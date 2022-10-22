import { getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataTimer, PoseVis } from "../../Edit/FrontUpload";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";

export default function Pose(props){
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [dataTimer, setDataTimer] = useState(null);

    useEffect(()=>{
        getDownloadURL(storageRef(`${performance.name}-pose`)).then((url) => {
            fetch(url).then((res) => res.json()).then((data) => {
                setDataTimer(new DataTimer(data));
            })
        })
    }, [performance])

    useEffect(()=>{
        if (dataTimer) dataTimer.reset()
    }, [layersData.reset])

    if (!dataTimer) return <div>...</div>
    
    return <PoseVis data={dataTimer.getDataforTime(layersData.time)} height={150}/>
}