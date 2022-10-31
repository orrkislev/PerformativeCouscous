import { getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { DataTimer } from "../../Edit/FrontUpload";
import { HandsVis } from "../../Edit/TopUpload";
import { storageRef } from "../../utils/useFirebase";
import { layersDataAtom, performanceAtom } from "../Layers";

export default function StateOfMind(props){
    const performance = useRecoilValue(performanceAtom);
    const layersData = useRecoilValue(layersDataAtom);
    const [dataTimer, setDataTimer] = useState(null);

    useEffect(()=>{
        console.log('useeffect')
        getDownloadURL(storageRef(`${performance.name}-expression`)).then((url) => {
            console.log(url)
            fetch(url).then((res) => res.json()).then((data) => {
                setDataTimer(new DataTimer(data));
            })
        })
    }, [performance])

    useEffect(()=>{
        if (dataTimer) dataTimer.reset()
    }, [layersData.reset])

    if (!dataTimer) return <div>...</div>

    const expression = dataTimer.getDataforTime(layersData.time)

    if (!expression) return <div>...</div>

    const strongestExpression = 
        expression[Object.keys(expression).reduce((a, b) => expression[a].probability > expression[b].probability ? a : b)].expression
    
    return (
        <>
            absl {strongestExpression}
        </>
    )
}