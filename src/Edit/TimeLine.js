import { useState } from "react";

export function TimeLineInput(props) {
    const [data, setData] = useState([]);

    return (
        <div>
            {data.map((d, i) => (
                <div key={i}>
                    <input type="number" value={d.time} onChange={(e) => {
                        const newData = [...data];
                        newData[i].time = e.target.value;
                        setData(newData);
                    }} />
                    <input type="text" value={d.text} onChange={(e) => {
                        const newData = [...data];
                        newData[i].text = e.target.value;
                        setData(newData);
                    }} />
                </div>
            ))}
            <div>
                <button onClick={() => setData([...data, { time: 0, text: '' }])}>Add</button>
            </div>
        </div>
    )
}