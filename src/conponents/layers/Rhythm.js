import { useEffect, useState } from "react";

export default function Rhythm(props) {

    const [data, setdata] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const newData = [...data]
            if (newData.length > 12) newData.shift();
            setdata([...newData, Math.random()])
        }, 100);
    }, [data])

    // draw spline curve from data
    const path = data.map((d, i) => {
        const x = i * 10;
        const y = 15 + d * 10;
        return `${i === 0 ? `M ${x} ${y}` : `T ${x} ${y}`}`
    }).join(' ');

    return (
        <div>
            <svg width="100%" height="100%" viewBox="0 0 100 50">
                <path d={path} stroke="blue" fill="none" />
            </svg>
        </div>
    )
}